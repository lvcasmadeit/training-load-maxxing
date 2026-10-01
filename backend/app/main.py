"""FastAPI application assembly for SquadPulse."""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as api_router
from app.config import get_cors_origins
from app.services.athlete_service import athlete_service


API_TITLE = "Athlete Training Load & Smartwatch API"
API_DESCRIPTION = "Python backend managing synthetic smartwatch streams, training load metrics (ACWR), and AI Coaching feedback."
API_VERSION = "1.0.0"


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    athlete_service.initialize()
    yield


def create_app() -> FastAPI:
    """Build the API app and attach its runtime integrations."""

    app = FastAPI(
        title=API_TITLE,
        description=API_DESCRIPTION,
        version=API_VERSION,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_cors_origins(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router)
    return app


app = create_app()
