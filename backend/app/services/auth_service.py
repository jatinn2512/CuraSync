from datetime import UTC, datetime, timedelta
from uuid import uuid4

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.db.session import get_core_db
from app.models.user import AuthSession, User
from app.models.user_profile import UserProfile, UserSettings
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UpdateProfileRequest

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def _get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email.lower().strip()))


def _get_user_by_phone(db: Session, phone: str) -> User | None:
    return db.scalar(select(User).where(User.phone == phone.strip()))


def _generate_placeholder_phone(db: Session) -> str:
    while True:
        candidate = f"9{uuid4().int % 1_000_000_000:09d}"
        if not _get_user_by_phone(db, candidate):
            return candidate


def create_user(db: Session, payload: RegisterRequest) -> User:
    if _get_user_by_email(db, payload.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

    resolved_phone = payload.phone.strip() if payload.phone else _generate_placeholder_phone(db)
    if _get_user_by_phone(db, resolved_phone):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Phone already exists")
    resolved_age = payload.age if payload.age is not None else 21

    user = User(
        full_name=payload.full_name.strip(),
        phone=resolved_phone,
        email=payload.email.lower().strip(),
        age=resolved_age,
        gender=payload.gender,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.flush()

    db.add(UserProfile(user_id=user.id, activity_level="moderate"))
    db.add(UserSettings(user_id=user.id))
    db.commit()
    db.refresh(user)
    return user


def _issue_token_pair(db: Session, user: User, user_agent: str | None = None, ip_address: str | None = None) -> TokenResponse:
    refresh_jti = uuid4().hex
    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id), refresh_jti)

    session = AuthSession(
        user_id=user.id,
        refresh_jti=refresh_jti,
        user_agent=user_agent,
        ip_address=ip_address,
        expires_at=datetime.now(UTC) + timedelta(days=settings.refresh_token_expire_days),
    )
    db.add(session)
    user.last_login_at = datetime.now(UTC)
    db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.access_token_expire_minutes * 60,
    )


def login_user(db: Session, payload: LoginRequest, user_agent: str | None = None, ip_address: str | None = None) -> TokenResponse:
    user = _get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled")

    return _issue_token_pair(db, user, user_agent, ip_address)


def refresh_login(db: Session, refresh_token: str, user_agent: str | None = None, ip_address: str | None = None) -> TokenResponse:
    try:
        payload = decode_token(refresh_token)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc
    token_type = payload.get("type")
    user_id = payload.get("sub")
    jti = payload.get("jti")

    if token_type != "refresh" or not user_id or not jti:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    session = db.scalar(
        select(AuthSession).where(
            AuthSession.refresh_jti == jti,
            AuthSession.user_id == int(user_id),
            AuthSession.revoked_at.is_(None),
        )
    )
    if not session or session.expires_at < datetime.now(UTC):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh session expired")

    session.revoked_at = datetime.now(UTC)
    user = db.scalar(select(User).where(User.id == int(user_id), User.is_active.is_(True)))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return _issue_token_pair(db, user, user_agent, ip_address)


def logout_with_refresh_token(db: Session, refresh_token: str) -> None:
    try:
        payload = decode_token(refresh_token)
    except ValueError:
        return
    jti = payload.get("jti")
    if not jti:
        return

    session = db.scalar(select(AuthSession).where(AuthSession.refresh_jti == jti, AuthSession.revoked_at.is_(None)))
    if session:
        session.revoked_at = datetime.now(UTC)
        db.commit()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_core_db)) -> User:
    try:
        payload = decode_token(token)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token") from exc
    token_type = payload.get("type")
    user_id = payload.get("sub")

    if token_type != "access" or not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token")

    user = db.scalar(select(User).where(User.id == int(user_id), User.is_active.is_(True)))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user


def update_profile(db: Session, user: User, payload: UpdateProfileRequest) -> User:
    if payload.full_name is not None:
        user.full_name = payload.full_name.strip()
    if payload.phone is not None and payload.phone != user.phone:
        existing_phone = _get_user_by_phone(db, payload.phone)
        if existing_phone and existing_phone.id != user.id:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Phone already exists")
        user.phone = payload.phone.strip()
    if payload.age is not None:
        user.age = payload.age
    if payload.gender is not None:
        user.gender = payload.gender

    profile = user.profile or UserProfile(user_id=user.id)
    if payload.height_cm is not None:
        profile.height_cm = payload.height_cm
    if payload.weight_kg is not None:
        profile.weight_kg = payload.weight_kg
    if payload.target_weight_kg is not None:
        profile.target_weight_kg = payload.target_weight_kg
    if payload.activity_level is not None:
        profile.activity_level = payload.activity_level
    if payload.medical_notes is not None:
        profile.medical_notes = payload.medical_notes

    db.add(profile)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
