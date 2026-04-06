from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.dish_nutrition import MealLog, RestaurantInteraction
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
    latest_food = db.scalar(
        select(MealLog)
        .where(
            MealLog.user_id == user_id,
            MealLog.meal_type == "Restaurant",
        )
        .order_by(MealLog.logged_at.desc())
    )
    latest_choice = db.scalar(
        select(RestaurantInteraction)
        .where(
            RestaurantInteraction.user_id == user_id,
            RestaurantInteraction.action == "choose_dish",
        )
        .order_by(RestaurantInteraction.created_at.desc())
    )
    alert_rows = db.execute(
        select(RestaurantInteraction.impact_label, func.count(RestaurantInteraction.id))
        .where(
            RestaurantInteraction.user_id == user_id,
            RestaurantInteraction.action == "choose_dish",
        )
        .group_by(RestaurantInteraction.impact_label)
    ).all()
    alert_counts = {"green": 0, "yellow": 0, "red": 0}
    for label, count in alert_rows:
        key = (label or "").strip().lower()
        if key in alert_counts:
            alert_counts[key] = int(count)

    sleep_payload = (
        {
            "sleep_date": latest_sleep.sleep_date,
            "duration_minutes": latest_sleep.duration_minutes,
            "quality_score": latest_sleep.quality_score,
        }
        if latest_sleep
        else None
    )
    activity_payload = (
        {
            "steps": latest_activity.steps,
            "workout_minutes": latest_activity.workout_minutes,
        }
        if latest_activity
        else None
    )
    vitals_payload = (
        {
            "heart_rate": latest_vitals.heart_rate,
            "systolic_bp": latest_vitals.systolic_bp,
        }
        if latest_vitals
        else None
    )
    food_payload = {
        "latest_item": latest_food.food_name if latest_food else None,
        "latest_logged_at": latest_food.logged_at if latest_food else None,
        "latest_calories": latest_food.calories if latest_food else None,
        "latest_sodium_mg": latest_food.sodium_mg if latest_food else None,
        "latest_note": latest_food.notes if latest_food else None,
        "latest_alert": latest_choice.impact_label if latest_choice else None,
        "latest_dish_name": latest_choice.dish_name if latest_choice else None,
        "latest_restaurant_name": latest_choice.restaurant_name if latest_choice else None,
        "latest_choice_at": latest_choice.created_at if latest_choice else None,
        "alert_counts": alert_counts,
        "recent_choices": sum(alert_counts.values()),
    }

    return {
        "sleep": sleep_payload,
        "activity": activity_payload,
        "vitals": vitals_payload,
        "food": food_payload,
    }
