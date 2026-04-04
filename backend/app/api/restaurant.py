from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_tracking_db
from app.models.user import User
from app.schemas.restaurant import RestaurantInteractionCreate, RestaurantInteractionOut
from app.services import auth_service, restaurant_service

router = APIRouter(prefix="/restaurant", tags=["Restaurant"])


@router.post("/interactions", response_model=RestaurantInteractionOut, status_code=201)
def create_interaction(
    payload: RestaurantInteractionCreate,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_tracking_db),
):
    return restaurant_service.log_interaction(db, current_user.id, payload)


@router.get("/interactions", response_model=list[RestaurantInteractionOut])
def get_interactions(
    limit: int = Query(default=50, ge=1, le=200),
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_tracking_db),
):
    return restaurant_service.list_interactions(db, current_user.id, limit)
