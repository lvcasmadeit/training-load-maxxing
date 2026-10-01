# Squad Pulse backend

FastAPI service for the synthetic athlete dashboard. The service keeps demo histories in process memory; restarting the service regenerates the sample data.

## Setup and run

From `backend/`:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-dev.txt
python run.py
```

Use Python 3.10 or newer. The API listens at `http://127.0.0.1:8000`; FastAPI's interactive documentation is at `http://127.0.0.1:8000/docs`.

`requirements.txt` contains runtime dependencies. `requirements-dev.txt` includes those requirements plus the test runner. The local `.venv/` is ignored by Git.

## Configuration

The service loads `backend/.env` when present; environment variables set by the hosting environment also work. Copy `.env.example` to `.env` for local configuration.

- `GEMINI_API_KEY` — optional server-side Gemini key. If unset, Insights use the local rule-based engine. Keep this value server-side; do not use a frontend `VITE_` variable.
- `SQUADPULSE_CORS_ORIGINS` — comma-separated, exact browser origins allowed to call the API. Set this to the deployed frontend origin(s). `CORS_ORIGINS` is accepted as a fallback name.

When neither CORS variable is set, the API allows the local Vite origins `http://localhost:5173` and `http://127.0.0.1:5173`. Wildcard origins are rejected.

## Code map

- `app/main.py` — FastAPI app creation, lifecycle initialization, middleware, and router registration.
- `app/api/routes.py` — HTTP endpoints and HTTP error mapping.
- `app/services/` — in-memory athlete operations, workout updates, and insight-engine selection.
- `app/formulas.py` — workload and readiness calculations.
- `app/data_pipeline.py` — synthetic athlete profiles, histories, and live-tick simulation.
- `app/insights_llm.py` — Gemini integration and local fallback.
- `app/models.py` — Pydantic request and response schemas.
- `tests/` — API, configuration, and formula tests.

## Tests

With the virtual environment active:

```bash
python -m pytest -q
```

The API endpoints are prefixed with `/api`; see the root [README](../README.md#api-overview) for the route list.
