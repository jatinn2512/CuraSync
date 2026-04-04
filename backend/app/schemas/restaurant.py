from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RestaurantInteractionCreate(BaseModel):
    restaurant_name: str = Field(min_length=2, max_length=150)
    action: str = Field(min_length=2, max_length=50)
    query_text: str | None = Field(default=None, max_length=255)
    dish_name: str | None = Field(default=None, max_length=150)
    impact_label: str | None = Field(default=None, max_length=40)


class RestaurantInteractionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    restaurant_name: str
    action: str
    query_text: str | None
    dish_name: str | None
    impact_label: str | None
    created_at: datetime
