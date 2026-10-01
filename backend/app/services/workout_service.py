"""Domain operations for applying a workout to the in-memory history."""

from __future__ import annotations

import datetime
from typing import Any, Dict, List, Optional

from app.formulas import enrich_athlete_history
from app.models import WorkoutSchema


def add_workout_to_history(
    history: List[Dict[str, Any]],
    athlete_profile: Dict[str, Any],
    workout: WorkoutSchema,
    today: Optional[datetime.date] = None,
) -> List[Dict[str, Any]]:
    """Apply a workout and recalculate the athlete's derived metrics.

    The demo intentionally keeps a rolling in-memory window.  A workout on
    the latest day is appended to that day's record; otherwise a new day is
    created and the oldest day is removed.
    """

    session_load = workout.duration_min * workout.rpe
    current_date = today or datetime.date.today()
    today_iso = current_date.isoformat()
    latest_day = history[-1]

    new_workout = {
        "id": f"w_live_{len(latest_day.get('workouts', []))}",
        "type": workout.type,
        "duration_min": workout.duration_min,
        "avg_hr": workout.avg_hr,
        "max_hr": workout.max_hr,
        "rpe": workout.rpe,
    }

    if latest_day["date"] == today_iso:
        latest_day["workouts"].append(new_workout)
        latest_day["daily_load"] += session_load
        workout_steps = workout.duration_min * 135 if workout.type in ["Run", "HIIT"] else 0
        latest_day["steps"] += int(workout_steps)
        latest_day["active_calories"] += int(workout.duration_min * (workout.rpe + 1.2))
    else:
        resting_hr = max(35, min(95, latest_day["resting_hr"] + 1))
        hrv = max(15, min(145, latest_day["hrv"] - 5))
        workout_steps = workout.duration_min * 135 if workout.type in ["Run", "HIIT"] else 0

        new_day = {
            "date": today_iso,
            "weekday": current_date.weekday(),
            "resting_hr": resting_hr,
            "hrv": hrv,
            "sleep_duration": latest_day["sleep_duration"],
            "sleep_quality": latest_day["sleep_quality"],
            "steps": int(8000 + workout_steps),
            "active_calories": int(400 + (workout.duration_min * (workout.rpe + 1.2))),
            "workouts": [new_workout],
            "daily_load": session_load,
        }
        history.pop(0)
        history.append(new_day)

    return enrich_athlete_history(history, hrv_base=athlete_profile["hrv_base"])
