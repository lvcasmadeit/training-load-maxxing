import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client() -> TestClient:
    with TestClient(app) as test_client:
        yield test_client


def test_athlete_and_history_responses_have_consumed_contracts(client: TestClient) -> None:
    athletes_response = client.get("/api/athletes")
    assert athletes_response.status_code == 200

    athletes = athletes_response.json()
    assert len(athletes) == 8
    athlete = athletes[0]
    assert {
        "id",
        "name",
        "sport",
        "age",
        "weight_kg",
        "bio",
        "current_status",
        "averages",
    } <= athlete.keys()
    assert {
        "readiness_score",
        "acwr",
        "acwr_zone",
        "acute_workload",
        "chronic_workload",
    } <= athlete["current_status"].keys()
    assert {"total_workouts", "avg_hrv", "avg_sleep_quality", "avg_acwr"} <= athlete[
        "averages"
    ].keys()

    history_response = client.get(f"/api/athletes/{athlete['id']}/history")
    assert history_response.status_code == 200
    history = history_response.json()
    assert len(history) == 45
    assert {
        "date",
        "resting_hr",
        "hrv",
        "sleep_duration",
        "sleep_quality",
        "steps",
        "active_calories",
        "workouts",
        "daily_load",
        "acute_workload",
        "chronic_workload",
        "acwr",
        "acwr_zone",
        "hrv_score",
        "readiness_score",
    } <= history[-1].keys()


def test_workout_live_tick_insights_and_reset_contracts(client: TestClient) -> None:
    workout_response = client.post(
        "/api/athletes/1/workout",
        json={
            "type": "Run",
            "duration_min": 30,
            "avg_hr": 140,
            "max_hr": 175,
            "rpe": 6,
        },
    )
    assert workout_response.status_code == 200
    assert workout_response.json()["id"] == "1"
    assert "current_status" in workout_response.json()

    live_tick_response = client.post(
        "/api/athletes/1/live-tick",
        json={"workout_type": "Match Play", "elapsed_seconds": 60},
    )
    assert live_tick_response.status_code == 200
    assert {
        "athlete_id",
        "elapsed_seconds",
        "heart_rate",
        "steps",
        "active_calories",
        "timestamp",
    } <= live_tick_response.json().keys()

    insights_response = client.get("/api/athletes/1/insights")
    assert insights_response.status_code == 200
    assert insights_response.json()["markdown"].startswith("# Performance & Sports-Science Report")

    reset_response = client.post("/api/athletes/reset")
    assert reset_response.status_code == 200
    assert reset_response.json() == {
        "status": "success",
        "message": "In-memory metrics successfully restored to baselines.",
    }


def test_unknown_athlete_keeps_existing_404_contract(client: TestClient) -> None:
    for path, method in [
        ("/api/athletes/missing/history", "get"),
        ("/api/athletes/missing/insights", "get"),
        ("/api/athletes/missing/live-tick", "post"),
    ]:
        if method == "post":
            response = client.post(path, json={"workout_type": "Run", "elapsed_seconds": 1})
        else:
            response = client.get(path)
        assert response.status_code == 404
        assert response.json()["detail"] == "Athlete not found"
