from collections.abc import Generator
from pathlib import Path

from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings


class CoreBase(DeclarativeBase):
    pass


class TrackingBase(DeclarativeBase):
    pass


def _create_engine(db_url: str) -> Engine:
    connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}
    engine = create_engine(db_url, connect_args=connect_args, future=True)

    if db_url.startswith("sqlite"):

        @event.listens_for(engine, "connect")
        def _set_sqlite_pragma(dbapi_connection, connection_record):
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.execute("PRAGMA journal_mode=WAL")
            cursor.close()

    return engine


def _ensure_sqlite_paths() -> None:
    for db_url in (settings.core_db_url, settings.tracking_db_url):
        if not db_url.startswith("sqlite:///"):
            continue
        raw_path = db_url.replace("sqlite:///", "", 1)
        path = Path(raw_path)
        if not path.is_absolute():
            path = Path.cwd() / path
        path.parent.mkdir(parents=True, exist_ok=True)


_ensure_sqlite_paths()
core_engine = _create_engine(settings.core_db_url)
tracking_engine = _create_engine(settings.tracking_db_url)

CoreSessionLocal = sessionmaker(bind=core_engine, autoflush=False, autocommit=False, expire_on_commit=False)
TrackingSessionLocal = sessionmaker(bind=tracking_engine, autoflush=False, autocommit=False, expire_on_commit=False)


def get_core_db() -> Generator[Session, None, None]:
    db = CoreSessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_tracking_db() -> Generator[Session, None, None]:
    db = TrackingSessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    from app.models import (  # noqa: F401
        aqi_snapshot,
        dish_nutrition,
        risk_assessment,
        user,
        user_profile,
        weekly_plan,
    )

    CoreBase.metadata.create_all(bind=core_engine)
    TrackingBase.metadata.create_all(bind=tracking_engine)
