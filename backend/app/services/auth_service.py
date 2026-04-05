from datetime import UTC, date, datetime, timedelta
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
from app.models.aqi_snapshot import AqiSnapshot
from app.models.dish_nutrition import HydrationLog, MealLog, NutritionGoal, RestaurantInteraction
from app.models.risk_assessment import ActivityLog, FeatureEvent, RiskAssessment, SleepLog, VitalsLog
from app.models.user import AuthSession, User
from app.models.user_profile import UserProfile, UserSettings
from app.models.weekly_plan import UserSubscription
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UpdateProfileRequest, UpdateSettingsRequest

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
    if payload.activity_level is not None:
        profile.activity_level = payload.activity_level
    if payload.medical_notes is not None:
        profile.medical_notes = payload.medical_notes

    db.add(profile)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_settings(db: Session, user: User) -> UserSettings:
    settings = user.settings
    if settings is None:
        settings = UserSettings(user_id=user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def update_user_settings(db: Session, user: User, payload: UpdateSettingsRequest) -> UserSettings:
    settings = user.settings or UserSettings(user_id=user.id)

    if payload.theme is not None:
        settings.theme = payload.theme
    if payload.units is not None:
        settings.units = payload.units
    if payload.notifications_enabled is not None:
        settings.notifications_enabled = payload.notifications_enabled
    if payload.email_alerts_enabled is not None:
        settings.email_alerts_enabled = payload.email_alerts_enabled
    if payload.community_visibility is not None:
        settings.community_visibility = payload.community_visibility
    if payload.location_access_for_aqi is not None:
        settings.location_access_for_aqi = payload.location_access_for_aqi

    db.add(settings)
    db.commit()
    db.refresh(settings)
    return settings


def _format_value(value: object) -> str:
    if value is None:
        return "N/A"
    if isinstance(value, datetime):
        return value.strftime("%Y-%m-%d %H:%M:%S")
    if isinstance(value, date):
        return value.strftime("%Y-%m-%d")
    if isinstance(value, bool):
        return "Yes" if value else "No"
    return str(value)


def _wrap_text(text: str, max_chars: int = 95) -> list[str]:
    raw = text.strip()
    if not raw:
        return [""]

    words = raw.split()
    lines: list[str] = []
    current = ""
    for word in words:
        if not current:
            current = word
            continue
        candidate = f"{current} {word}"
        if len(candidate) <= max_chars:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def _escape_pdf_text(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def _build_pdf(lines: list[str]) -> bytes:
    if not lines:
        lines = ["No user data available."]

    lines_per_page = 45
    pages = [lines[index : index + lines_per_page] for index in range(0, len(lines), lines_per_page)]
    if not pages:
        pages = [["No user data available."]]

    object_contents: dict[int, bytes] = {}
    page_count = len(pages)
    font_obj_num = 3 + (page_count * 2)

    object_contents[1] = b"<< /Type /Catalog /Pages 2 0 R >>"
    kids_refs = " ".join(f"{3 + (index * 2)} 0 R" for index in range(page_count))
    object_contents[2] = f"<< /Type /Pages /Count {page_count} /Kids [{kids_refs}] >>".encode()

    for page_index, page_lines in enumerate(pages):
        page_obj_num = 3 + (page_index * 2)
        content_obj_num = 4 + (page_index * 2)

        stream_lines = ["BT", "/F1 10 Tf", "50 790 Td", "14 TL"]
        first_line = True
        for line in page_lines:
            escaped = _escape_pdf_text(line)
            if first_line:
                stream_lines.append(f"({escaped}) Tj")
                first_line = False
            else:
                stream_lines.append("T*")
                stream_lines.append(f"({escaped}) Tj")
        if first_line:
            stream_lines.append("(No user data available.) Tj")
        stream_lines.append("ET")

        stream = "\n".join(stream_lines).encode("latin-1", "replace")
        object_contents[page_obj_num] = (
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] "
            f"/Resources << /Font << /F1 {font_obj_num} 0 R >> >> "
            f"/Contents {content_obj_num} 0 R >>"
        ).encode()
        object_contents[content_obj_num] = f"<< /Length {len(stream)} >>\nstream\n".encode() + stream + b"\nendstream"

    object_contents[font_obj_num] = b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
    max_obj_num = font_obj_num

    pdf = bytearray()
    pdf.extend(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")

    offsets: dict[int, int] = {}
    for obj_num in range(1, max_obj_num + 1):
        offsets[obj_num] = len(pdf)
        pdf.extend(f"{obj_num} 0 obj\n".encode())
        pdf.extend(object_contents[obj_num])
        pdf.extend(b"\nendobj\n")

    xref_start = len(pdf)
    pdf.extend(f"xref\n0 {max_obj_num + 1}\n".encode())
    pdf.extend(b"0000000000 65535 f \n")
    for obj_num in range(1, max_obj_num + 1):
        pdf.extend(f"{offsets[obj_num]:010d} 00000 n \n".encode())

    pdf.extend(f"trailer\n<< /Size {max_obj_num + 1} /Root 1 0 R >>\nstartxref\n{xref_start}\n%%EOF".encode())
    return bytes(pdf)


def export_user_data_pdf(core_db: Session, tracking_db: Session, user: User) -> bytes:
    settings_obj = get_user_settings(core_db, user)
    profile = user.profile

    subscription = core_db.scalar(
        select(UserSubscription)
        .where(UserSubscription.user_id == user.id)
        .order_by(UserSubscription.started_at.desc())
    )
    if subscription:
        core_db.refresh(subscription, attribute_names=["plan"])

    meals = list(
        tracking_db.scalars(select(MealLog).where(MealLog.user_id == user.id).order_by(MealLog.logged_at.desc())).all()
    )
    hydration_logs = list(
        tracking_db.scalars(select(HydrationLog).where(HydrationLog.user_id == user.id).order_by(HydrationLog.logged_at.desc())).all()
    )
    goal = tracking_db.scalar(select(NutritionGoal).where(NutritionGoal.user_id == user.id))
    aqi_snapshots = list(
        tracking_db.scalars(select(AqiSnapshot).where(AqiSnapshot.user_id == user.id).order_by(AqiSnapshot.captured_at.desc())).all()
    )
    sleep_logs = list(
        tracking_db.scalars(select(SleepLog).where(SleepLog.user_id == user.id).order_by(SleepLog.sleep_date.desc())).all()
    )
    activity_logs = list(
        tracking_db.scalars(select(ActivityLog).where(ActivityLog.user_id == user.id).order_by(ActivityLog.logged_at.desc())).all()
    )
    vitals_logs = list(
        tracking_db.scalars(select(VitalsLog).where(VitalsLog.user_id == user.id).order_by(VitalsLog.logged_at.desc())).all()
    )
    risk_assessments = list(
        tracking_db.scalars(select(RiskAssessment).where(RiskAssessment.user_id == user.id).order_by(RiskAssessment.generated_at.desc())).all()
    )
    feature_events = list(
        tracking_db.scalars(select(FeatureEvent).where(FeatureEvent.user_id == user.id).order_by(FeatureEvent.created_at.desc())).all()
    )
    restaurant_logs = list(
        tracking_db.scalars(
            select(RestaurantInteraction).where(RestaurantInteraction.user_id == user.id).order_by(RestaurantInteraction.created_at.desc())
        ).all()
    )

    lines: list[str] = []
    lines.extend(_wrap_text("CuraSync User Data Export"))
    lines.extend(_wrap_text(f"Generated at: {_format_value(datetime.now(UTC))}"))
    lines.append("")

    lines.extend(_wrap_text("ACCOUNT"))
    lines.extend(_wrap_text(f"User ID: {user.id}"))
    lines.extend(_wrap_text(f"Name: {user.full_name}"))
    lines.extend(_wrap_text(f"Email: {user.email}"))
    lines.extend(_wrap_text(f"Phone: {user.phone}"))
    lines.extend(_wrap_text(f"Age: {_format_value(user.age)}"))
    lines.extend(_wrap_text(f"Gender: {_format_value(user.gender)}"))
    lines.extend(_wrap_text(f"Created At: {_format_value(user.created_at)}"))
    lines.extend(_wrap_text(f"Last Login: {_format_value(user.last_login_at)}"))

    lines.append("")
    lines.extend(_wrap_text("PROFILE"))
    lines.extend(_wrap_text(f"Height (cm): {_format_value(profile.height_cm if profile else None)}"))
    lines.extend(_wrap_text(f"Weight (kg): {_format_value(profile.weight_kg if profile else None)}"))
    lines.extend(_wrap_text(f"Target Weight (kg): {_format_value(profile.target_weight_kg if profile else None)}"))
    lines.extend(_wrap_text(f"Activity Level: {_format_value(profile.activity_level if profile else None)}"))
    lines.extend(_wrap_text(f"Medical Notes: {_format_value(profile.medical_notes if profile else None)}"))

    lines.append("")
    lines.extend(_wrap_text("SETTINGS"))
    lines.extend(_wrap_text(f"Theme: {settings_obj.theme}"))
    lines.extend(_wrap_text(f"Units: {settings_obj.units}"))
    lines.extend(_wrap_text(f"Notifications: {_format_value(settings_obj.notifications_enabled)}"))
    lines.extend(_wrap_text(f"Email Alerts: {_format_value(settings_obj.email_alerts_enabled)}"))
    lines.extend(_wrap_text(f"Community Visibility: {settings_obj.community_visibility}"))
    lines.extend(_wrap_text(f"AQI Location Access: {_format_value(settings_obj.location_access_for_aqi)}"))

    lines.append("")
    lines.extend(_wrap_text("SUBSCRIPTION"))
    if subscription and subscription.plan:
        lines.extend(_wrap_text(f"Plan: {subscription.plan.name} ({subscription.plan.code})"))
        lines.extend(_wrap_text(f"Billing Cycle: {_format_value(subscription.billing_cycle)}"))
        lines.extend(_wrap_text(f"Status: {_format_value(subscription.status)}"))
        lines.extend(_wrap_text(f"Started At: {_format_value(subscription.started_at)}"))
        lines.extend(_wrap_text(f"Ends At: {_format_value(subscription.ends_at)}"))
    else:
        lines.extend(_wrap_text("No subscription records."))

    lines.append("")
    lines.extend(_wrap_text(f"NUTRITION GOAL ({'Available' if goal else 'Not set'})"))
    if goal:
        lines.extend(_wrap_text(f"Calories: {goal.calorie_target}"))
        lines.extend(_wrap_text(f"Protein (g): {goal.protein_target_g}"))
        lines.extend(_wrap_text(f"Carbs (g): {goal.carbs_target_g}"))
        lines.extend(_wrap_text(f"Fat (g): {goal.fat_target_g}"))
        lines.extend(_wrap_text(f"Water (ml): {goal.water_target_ml}"))

    def append_records(title: str, records: list[str]) -> None:
        lines.append("")
        lines.extend(_wrap_text(f"{title} ({len(records)})"))
        if not records:
            lines.extend(_wrap_text("No records."))
            return
        for record in records:
            lines.extend(_wrap_text(record))

    append_records(
        "MEAL LOGS",
        [
            f"{index}. {_format_value(meal.logged_at)} | {meal.meal_type} | {meal.food_name} | "
            f"{meal.calories} kcal | P/C/F: {meal.protein_g}/{meal.carbs_g}/{meal.fat_g}"
            for index, meal in enumerate(meals, start=1)
        ],
    )
    append_records(
        "HYDRATION LOGS",
        [f"{index}. {_format_value(log.logged_at)} | {log.amount_ml} ml" for index, log in enumerate(hydration_logs, start=1)],
    )
    append_records(
        "AQI SNAPSHOTS",
        [
            f"{index}. {_format_value(snapshot.captured_at)} | {snapshot.city} | AQI {snapshot.aqi_value} ({snapshot.category})"
            for index, snapshot in enumerate(aqi_snapshots, start=1)
        ],
    )
    append_records(
        "SLEEP LOGS",
        [
            f"{index}. {_format_value(log.sleep_date)} | Duration: {log.duration_minutes} mins | Quality: {_format_value(log.quality_score)}"
            for index, log in enumerate(sleep_logs, start=1)
        ],
    )
    append_records(
        "ACTIVITY LOGS",
        [
            f"{index}. {_format_value(log.logged_at)} | Steps: {log.steps} | Workout: {log.workout_minutes} mins | "
            f"Calories: {log.calories_burned}"
            for index, log in enumerate(activity_logs, start=1)
        ],
    )
    append_records(
        "VITALS LOGS",
        [
            f"{index}. {_format_value(log.logged_at)} | HR: {_format_value(log.heart_rate)} | BP: "
            f"{_format_value(log.systolic_bp)}/{_format_value(log.diastolic_bp)} | SpO2: {_format_value(log.spo2)}"
            for index, log in enumerate(vitals_logs, start=1)
        ],
    )
    append_records(
        "RISK ASSESSMENTS",
        [
            f"{index}. {_format_value(log.generated_at)} | {log.risk_type} | {log.risk_level} | {log.summary}"
            for index, log in enumerate(risk_assessments, start=1)
        ],
    )
    append_records(
        "FEATURE EVENTS",
        [
            f"{index}. {_format_value(log.created_at)} | {log.feature}:{log.action} | metadata: {_format_value(log.metadata_json)}"
            for index, log in enumerate(feature_events, start=1)
        ],
    )
    append_records(
        "RESTAURANT INTERACTIONS",
        [
            f"{index}. {_format_value(log.created_at)} | {log.restaurant_name} | {log.action} | "
            f"dish: {_format_value(log.dish_name)}"
            for index, log in enumerate(restaurant_logs, start=1)
        ],
    )

    return _build_pdf(lines)
