from datetime import date
from typing import List, Optional

from pydantic import BaseModel, Field


class WorkoutSchema(BaseModel):
    type: str = Field(
        ...,
        description="Type of workout (Match Play, Tactical Session, Conditioning Split, Gym/Strength)",
    )
    duration_min: int = Field(..., gt=0, description="Duration in minutes")
    avg_hr: int = Field(..., gt=30, description="Average heart rate during workout")
    max_hr: int = Field(..., gt=30, description="Max heart rate during workout")
    rpe: int = Field(..., ge=1, le=10, description="Rating of Perceived Exertion (1 to 10)")


class WorkoutRecord(BaseModel):
    """A workout entry returned as part of an athlete history response."""

    id: str
    type: str
    duration_min: int
    avg_hr: int
    max_hr: int
    rpe: int


class LiveTickRequest(BaseModel):
    workout_type: str = Field(..., description="Active workout type to simulate")
    elapsed_seconds: int = Field(..., ge=0, description="Elapsed time in seconds for the workout")


class LiveTickResponse(BaseModel):
    athlete_id: str
    elapsed_seconds: int
    heart_rate: int
    steps: int
    active_calories: int
    timestamp: str


class APIKeyRequest(BaseModel):
    api_key: str = Field(..., description="Google Gemini API Key")


class AIInsightsResponse(BaseModel):
    markdown: str = Field(..., description="Rich Markdown performance report from the AI Coach")


class AthleteHistoryEntry(BaseModel):
    """One enriched day in the 45-day smartwatch history."""

    date: date
    weekday: Optional[int] = None
    resting_hr: int
    hrv: int
    sleep_duration: float
    sleep_quality: int
    steps: int
    active_calories: int
    workouts: List[WorkoutRecord]
    daily_load: int
    acute_workload: float
    chronic_workload: float
    acwr: float
    acwr_zone: str
    hrv_score: int
    readiness_score: int


class AthleteCurrentStatus(BaseModel):
    """The latest enriched metrics shown on the team and detail views."""

    date: date
    resting_hr: int
    hrv: int
    sleep_duration: float
    sleep_quality: int
    steps: int
    active_calories: int
    daily_load: int
    acute_workload: float
    chronic_workload: float
    acwr: float
    acwr_zone: str
    readiness_score: int


class AthleteAverages(BaseModel):
    total_workouts: int
    avg_hrv: float
    avg_sleep_quality: float
    avg_acwr: float


class AthleteSummary(BaseModel):
    """Summary payload consumed by the team and athlete detail pages."""

    id: str
    name: str
    sport: str
    age: int
    weight_kg: float
    bio: str
    current_status: AthleteCurrentStatus
    averages: AthleteAverages


class ResetResponse(BaseModel):
    status: str
    message: str
