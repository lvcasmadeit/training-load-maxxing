"""Application services for the in-memory athlete data set."""

from __future__ import annotations

from typing import Any, Dict, List, Mapping

from app.data_pipeline import ATHLETE_PROFILES, generate_athlete_history, get_live_tick_data
from app.formulas import enrich_athlete_history, get_current_athlete_summary
from app.models import LiveTickRequest, WorkoutSchema
from app.services.workout_service import add_workout_to_history


class AthleteNotFoundError(LookupError):
    """Raised when an athlete is not present in the configured demo data."""


class AthleteService:
    """Owns the demo profiles and their mutable in-memory histories."""

    def __init__(self, profiles: Mapping[str, Dict[str, Any]] | None = None) -> None:
        self.profiles = ATHLETE_PROFILES if profiles is None else profiles
        self.data_store: Dict[str, List[Dict[str, Any]]] = {}

    def initialize(self) -> None:
        """Generate a fresh synthetic history for every configured athlete."""

        print("[DB] Initializing In-Memory Athlete Database...")
        self.data_store.clear()
        for athlete_id, profile in self.profiles.items():
            raw_history = generate_athlete_history(athlete_id, days=45)
            enriched_history = enrich_athlete_history(raw_history, hrv_base=profile["hrv_base"])
            self.data_store[athlete_id] = enriched_history
        print("[DB] Athlete Database Successfully Loaded!")

    def list_summaries(self) -> List[Dict[str, Any]]:
        """Return current summaries, skipping histories that are unavailable."""

        summaries = []
        for athlete_id, profile in self.profiles.items():
            history = self.data_store.get(athlete_id)
            if not history:
                continue
            summaries.append(get_current_athlete_summary(history, profile))
        return summaries

    def get_history(self, athlete_id: str) -> List[Dict[str, Any]]:
        if athlete_id not in self.data_store:
            raise AthleteNotFoundError(athlete_id)
        return self.data_store[athlete_id]

    def get_profile(self, athlete_id: str) -> Dict[str, Any]:
        if athlete_id not in self.profiles:
            raise AthleteNotFoundError(athlete_id)
        return self.profiles[athlete_id]

    def get_summary(self, athlete_id: str) -> Dict[str, Any]:
        history = self.get_history(athlete_id)
        profile = self.get_profile(athlete_id)
        return get_current_athlete_summary(history, profile)

    def add_workout(self, athlete_id: str, workout: WorkoutSchema) -> Dict[str, Any]:
        history = self.get_history(athlete_id)
        profile = self.get_profile(athlete_id)
        self.data_store[athlete_id] = add_workout_to_history(history, profile, workout)
        return get_current_athlete_summary(self.data_store[athlete_id], profile)

    def live_tick(self, athlete_id: str, request: LiveTickRequest) -> Dict[str, Any]:
        self.get_profile(athlete_id)
        return get_live_tick_data(
            player_id=athlete_id,
            workout_type=request.workout_type,
            elapsed_seconds=request.elapsed_seconds,
        )

    def reset(self) -> None:
        self.initialize()


athlete_service = AthleteService()
