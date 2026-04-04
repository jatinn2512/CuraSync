from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.dish_nutrition import RestaurantInteraction
from app.schemas.restaurant import RestaurantInteractionCreate


def log_interaction(db: Session, user_id: int, payload: RestaurantInteractionCreate) -> RestaurantInteraction:
    interaction = RestaurantInteraction(user_id=user_id, **payload.model_dump())
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return interaction


def list_interactions(db: Session, user_id: int, limit: int = 50) -> list[RestaurantInteraction]:
    return list(
        db.scalars(
            select(RestaurantInteraction)
            .where(RestaurantInteraction.user_id == user_id)
            .order_by(RestaurantInteraction.created_at.desc())
            .limit(limit)
        )
    )
