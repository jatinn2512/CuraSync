from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.user import User
from app.models.weekly_plan import Plan, PlanFeature, UserSubscription

DEFAULT_PLANS = [
    {
        "code": "current",
        "name": "Current Plan",
        "monthly_price_inr": 0,
        "yearly_price_inr": 0,
        "description": "Starter access for core CuraSync functionality.",
        "features": [
            ("dashboard", "Dashboard overview"),
            ("tracking", "Basic health tracking"),
            ("community", "Community access"),
        ],
    },
    {
        "code": "pro",
        "name": "Pro",
        "monthly_price_inr": 299,
        "yearly_price_inr": 3289,
        "description": "Advanced recommendations and deeper analytics.",
        "features": [
            ("all_current", "Everything in Current Plan"),
            ("smart_diet", "Advanced AI food guidance"),
            ("priority_insights", "Priority recommendations"),
            ("deep_reports", "Detailed trend reports"),
        ],
    },
]


def ensure_default_plans(db: Session) -> None:
    existing_codes = {row[0] for row in db.execute(select(Plan.code)).all()}

    for plan_data in DEFAULT_PLANS:
        if plan_data["code"] in existing_codes:
            continue
        plan = Plan(
            code=plan_data["code"],
            name=plan_data["name"],
            monthly_price_inr=plan_data["monthly_price_inr"],
            yearly_price_inr=plan_data["yearly_price_inr"],
            description=plan_data["description"],
        )
        db.add(plan)
        db.flush()
        for feature_key, feature_label in plan_data["features"]:
            db.add(PlanFeature(plan_id=plan.id, feature_key=feature_key, feature_label=feature_label))

    db.commit()


def list_plans(db: Session) -> list[Plan]:
    return list(
        db.scalars(select(Plan).where(Plan.is_active.is_(True)).options(selectinload(Plan.features)).order_by(Plan.monthly_price_inr.asc()))
    )


def subscribe_user(db: Session, user: User, plan_code: str, billing_cycle: str) -> UserSubscription:
    plan = db.scalar(select(Plan).where(Plan.code == plan_code, Plan.is_active.is_(True)))
    if not plan:
        raise ValueError("Plan not found")

    active_subscriptions = db.scalars(
        select(UserSubscription).where(UserSubscription.user_id == user.id, UserSubscription.status == "active")
    ).all()
    for sub in active_subscriptions:
        sub.status = "inactive"
        sub.ends_at = datetime.now(UTC)

    new_sub = UserSubscription(
        user_id=user.id,
        plan_id=plan.id,
        billing_cycle=billing_cycle,
        status="active",
        started_at=datetime.now(UTC),
        auto_renew=True,
    )
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    return new_sub


def get_active_subscription(db: Session, user_id: int) -> UserSubscription | None:
    return db.scalar(
        select(UserSubscription)
        .where(UserSubscription.user_id == user_id, UserSubscription.status == "active")
        .order_by(UserSubscription.started_at.desc())
    )
