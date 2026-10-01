"""Runtime configuration for the SquadPulse API."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv


# Keep local backend secrets in backend/.env without checking them into source.
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")


DEFAULT_CORS_ORIGINS = (
    "http://localhost:5173",
    "http://127.0.0.1:5173",
)
_CORS_ENV_VARS = ("SQUADPULSE_CORS_ORIGINS", "CORS_ORIGINS")


def get_cors_origins(configured_origins: Optional[str] = None) -> list[str]:
    """Return the explicitly allowed browser origins for the API.

    Production deployments should set ``SQUADPULSE_CORS_ORIGINS`` to a
    comma-separated list of frontend origins.  Local development keeps the
    two Vite hostnames explicit instead of falling back to a wildcard.
    """

    raw_origins = configured_origins
    if raw_origins is None:
        for variable_name in _CORS_ENV_VARS:
            raw_origins = os.getenv(variable_name)
            if raw_origins is not None:
                break

    if raw_origins is None or not raw_origins.strip():
        return list(DEFAULT_CORS_ORIGINS)

    origins = [origin.strip().rstrip("/") for origin in raw_origins.split(",")]
    origins = [origin for origin in origins if origin]
    if not origins:
        return list(DEFAULT_CORS_ORIGINS)
    if "*" in origins:
        raise ValueError(
            "Wildcard CORS origins are not supported; configure explicit frontend origins."
        )
    return origins
