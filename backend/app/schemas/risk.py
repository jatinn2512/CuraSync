from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class SleepLogCreate(BaseModel):
    sleep_date: date
    duration_minutes: int = Field(ge=0, le=1440)
    sleep_start: datetime | None = None
    sleep_end: datetime | None = None
    quality_score: int | None = Field(default=None, ge=0, le=100)


class ActivityLogCreate(BaseModel):
    steps: int = Field(ge=0)
    workout_minutes: int = Field(ge=0)
    calories_burned: int = Field(ge=0)
    distance_km: float | None = Field(default=None, ge=0)


class VitalsLogCreate(BaseModel):
    heart_rate: int | None = Field(default=None, ge=20, le=260)
    systolic_bp: int | None = Field(default=None, ge=60, le=250)
    diastolic_bp: int | None = Field(default=None, ge=40, le=180)
    spo2: float | None = Field(default=None, ge=50, le=100)
    temperature_c: float | None = Field(default=None, ge=30, le=45)


class FeatureEventCreate(BaseModel):
    feature: str = Field(min_length=2, max_length=80)
    action: str = Field(min_length=2, max_length=80)
    metadata_json: str | None = None


class RiskAssessmentCreate(BaseModel):
    risk_type: str = Field(min_length=2, max_length=80)
    risk_level: str = Field(min_length=2, max_length=30)
    summary: str = Field(min_length=2)


class SleepLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sleep_date: date
    duration_minutes: int
    quality_score: int | None
    created_at: datetime


class ActivityLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    steps: int
    workout_minutes: int
    calories_burned: int
    distance_km: float | None
    logged_at: datetime


class VitalsLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    heart_rate: int | None
    systolic_bp: int | None
    diastolic_bp: int | None
    spo2: float | None
    temperature_c: float | None
    logged_at: datetime
