"""Service boundary for local and Gemini-powered athlete insights."""

from __future__ import annotations

import os
from typing import Any, Dict, List, Optional

from app.insights_llm import generate_gemini_insights, generate_local_insights


def generate_athlete_insights(
    athlete_summary: Dict[str, Any],
    history: List[Dict[str, Any]],
    request_api_key: Optional[str] = None,
) -> Dict[str, Any]:
    """Choose the configured Gemini engine or the deterministic local fallback."""

    background_api_key = os.environ.get("GEMINI_API_KEY", "")
    api_key = background_api_key or request_api_key

    if api_key and len(api_key.strip()) > 10:
        print(f"[AI] Invoking LIVE Gemini API Coach for {athlete_summary['name']}...")
        return generate_gemini_insights(athlete_summary, history, api_key=api_key)

    print(f"[AI] Invoking Local Offline Coach for {athlete_summary['name']}...")
    return generate_local_insights(athlete_summary, history)
