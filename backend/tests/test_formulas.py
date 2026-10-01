from app.formulas import calculate_acwr_zone, compute_rolling_average, enrich_athlete_history


def test_compute_rolling_average_uses_available_history_at_the_start() -> None:
    assert compute_rolling_average([10, 20, 30, 40], window=3) == [10, 15, 20, 30]


def test_acwr_zone_boundaries_match_the_dashboard_contract() -> None:
    assert calculate_acwr_zone(0.79) == "Under-training"
    assert calculate_acwr_zone(0.8) == "Sweet Spot"
    assert calculate_acwr_zone(1.3) == "Sweet Spot"
    assert calculate_acwr_zone(1.31) == "Buffer Zone"
    assert calculate_acwr_zone(1.5) == "Buffer Zone"
    assert calculate_acwr_zone(1.51) == "Danger Zone"


def test_enrichment_adds_load_and_readiness_fields() -> None:
    history = [
        {
            "date": "2024-01-01",
            "resting_hr": 50,
            "hrv": 80,
            "sleep_duration": 8.0,
            "sleep_quality": 90,
            "steps": 8000,
            "active_calories": 500,
            "workouts": [
                {
                    "id": "w_1",
                    "type": "Tactical Drill",
                    "duration_min": 60,
                    "avg_hr": 130,
                    "max_hr": 160,
                    "rpe": 5,
                }
            ],
        }
    ]

    enriched = enrich_athlete_history(history, hrv_base=80)

    assert enriched[0]["daily_load"] == 300
    assert enriched[0]["acute_workload"] == 300.0
    assert enriched[0]["chronic_workload"] == 300.0
    assert enriched[0]["acwr"] == 1.0
    assert enriched[0]["acwr_zone"] == "Sweet Spot"
    assert enriched[0]["readiness_score"] == 76
