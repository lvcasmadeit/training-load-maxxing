"""HTTP routes for the SquadPulse API."""

from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Header, HTTPException

from app.models import (
    AIInsightsResponse,
    AthleteHistoryEntry,
    AthleteSummary,
    LiveTickRequest,
    LiveTickResponse,
    ResetResponse,
    WorkoutSchema,
)
from app.services.athlete_service import AthleteNotFoundError, athlete_service
from app.services.insights_service import generate_athlete_insights


router = APIRouter(prefix="/api")


def _athlete_not_found() -> HTTPException:
    return HTTPException(status_code=404, detail="Athlete not found")


@router.get("/athletes", response_model=List[AthleteSummary], description="Returns active roster summary of all athletes.")
def get_athletes() -> List[dict]:
    return athlete_service.list_summaries()


@router.get(
    "/athletes/{athlete_id}/history",
    response_model=List[AthleteHistoryEntry],
    response_model_exclude_none=True,
    description="Returns the 45-day detailed smartwatch timeseries for charts.",
)
def get_athlete_history(athlete_id: str) -> List[dict]:
    try:
        return athlete_service.get_history(athlete_id)
    except AthleteNotFoundError as error:
        raise _athlete_not_found() from error


@router.get(
    "/athletes/{athlete_id}/insights",
    response_model=AIInsightsResponse,
    description="Returns LLM-powered or local-heuristic training insights.",
)
def get_athlete_insights(
    athlete_id: str,
    x_gemini_key: Optional[str] = Header(None, alias="X-Gemini-Key"),
) -> dict:
    try:
        history = athlete_service.get_history(athlete_id)
        summary = athlete_service.get_summary(athlete_id)
    except AthleteNotFoundError as error:
        raise _athlete_not_found() from error

    return generate_athlete_insights(summary, history, request_api_key=x_gemini_key)


@router.post(
    "/athletes/{athlete_id}/workout",
    response_model=AthleteSummary,
    description="Ingests a new workout from simulated smartwatch, updating physical metrics.",
)
def add_workout(athlete_id: str, workout: WorkoutSchema) -> dict:
    try:
        return athlete_service.add_workout(athlete_id, workout)
    except AthleteNotFoundError as error:
        raise _athlete_not_found() from error


@router.post(
    "/athletes/{athlete_id}/live-tick",
    response_model=LiveTickResponse,
    description="Calculates simulated instant watch metrics in real-time.",
)
def post_live_tick(athlete_id: str, request: LiveTickRequest) -> dict:
    try:
        return athlete_service.live_tick(athlete_id, request)
    except AthleteNotFoundError as error:
        raise _athlete_not_found() from error


@router.post(
    "/athletes/reset",
    response_model=ResetResponse,
    description="Resets the in-memory database to fresh synthetic sets.",
)
def reset_database() -> dict:
    athlete_service.reset()
    return {"status": "success", "message": "In-memory metrics successfully restored to baselines."}
