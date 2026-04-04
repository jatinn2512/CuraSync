from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.risk_assessment import ActivityLog, FeatureEvent, RiskAssessment, SleepLog, VitalsLog
from app.schemas.risk import ActivityLogCreate, FeatureEventCreate, RiskAssessmentCreate, SleepLogCreate, VitalsLogCreate


def create_sleep_log(db: Session, user_id: int, payload: SleepLogCreate) -> SleepLog:
    log = SleepLog(user_id=user_id, **payload.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def create_activity_log(db: Session, user_id: int, payload: ActivityLogCreate) -> ActivityLog:
    log = ActivityLog(user_id=user_id, **payload.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def create_vitals_log(db: Session, user_id: int, payload: VitalsLogCreate) -> VitalsLog:
    log = VitalsLog(user_id=user_id, **payload.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def create_feature_event(db: Session, user_id: int, payload: FeatureEventCreate) -> FeatureEvent:
    event = FeatureEvent(user_id=user_id, **payload.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


def create_risk_assessment(db: Session, user_id: int, payload: RiskAssessmentCreate) -> RiskAssessment:
    assessment = RiskAssessment(user_id=user_id, **payload.model_dump())
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment


def latest_overview(db: Session, user_id: int) -> dict:
    latest_sleep = db.scalar(select(SleepLog).where(SleepLog.user_id == user_id).order_by(SleepLog.created_at.desc()))
    latest_activity = db.scalar(select(ActivityLog).where(ActivityLog.user_id == user_id).order_by(ActivityLog.logged_at.desc()))
    latest_vitals = db.scalar(select(VitalsLog).where(VitalsLog.user_id == user_id).order_by(VitalsLog.logged_at.desc()))

    return {
        "sleep": latest_sleep,
        "activity": latest_activity,
        "vitals": latest_vitals,
    }
