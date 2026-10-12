# Squad Pulse

Squad Pulse is a prototype dashboard for reviewing team training load, recovery, and athlete insights. It currently uses **synthetic smartwatch-style data**; it does not connect to Apple Health, Garmin, Fitbit, or other wearable services.

## What the prototype does

- Generates 45 days of sample history for eight demo athletes.
- Calculates daily, acute (7-day), and chronic (28-day) workload, ACWR zones, and a readiness score.
- Serves athlete summaries, histories, insights, workout updates, and simulated live-tick data through a FastAPI API.
- Provides local rule-based insights, with optional Gemini-generated insights and a local fallback.

The data is held in memory and is regenerated when the backend starts or is reset. Metrics and recommendations are for demonstration and educational use, not medical advice or validated injury predictions.

## Repository layout

```text
backend/
  app/
    api/routes.py          # HTTP routes
    services/              # Athlete state, workout updates, insights selection
    config.py              # Environment and CORS configuration
    data_pipeline.py       # Synthetic profiles and history generation
    formulas.py            # Workload and readiness calculations
    insights_llm.py        # Gemini and local insights engines
    models.py              # API request/response schemas
  tests/                   # Formula, configuration, and API tests
  requirements.txt
  requirements-dev.txt
  README.md
frontend/
  src/
    app/App.tsx            # Application routes
    features/              # Home, team, athlete, and insights UI
    shared/components/     # UI shared across features
    utils/api.ts           # Browser API client
  README.md
CONTEXT.md                 # Product vocabulary
vercel.json                # Frontend deployment configuration
```

The frontend and backend are separate applications with their own dependencies, but remain in one repository.

## Run locally

Use two terminals.

**Backend** — see [backend/README.md](backend/README.md) for environment and test setup:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-dev.txt
python run.py
```

The API listens at `http://127.0.0.1:8000`; interactive API docs are at `http://127.0.0.1:8000/docs`.

**Frontend:**

```bash
cd frontend
npm ci
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). Vite proxies `/api` requests to `http://localhost:8000` by default. See [frontend/README.md](frontend/README.md) for frontend configuration.

## Checks

With the backend virtual environment active:

```bash
cd backend
python -m pytest -q
```

Frontend checks, from `frontend/`:

```bash
npm run typecheck
npm run lint
npm run build
```

## API overview

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/athletes` | Team athlete summaries |
| `GET` | `/api/athletes/{athlete_id}/history` | Daily history for one athlete |
| `GET` | `/api/athletes/{athlete_id}/insights` | Coaching insights |
| `POST` | `/api/athletes/{athlete_id}/workout` | Add a workout to the demo history |
| `POST` | `/api/athletes/{athlete_id}/live-tick` | Generate simulated live workout metrics |
| `POST` | `/api/athletes/reset` | Regenerate the in-memory demo data |

## Configuration and deployment

The Vite development proxy targets `http://localhost:8000` by default. Override it with `VITE_API_PROXY_TARGET` in the frontend environment for local development. The browser API base defaults to `/api`; set `VITE_API_BASE_URL` to an absolute API base ending in `/api` when the deployed frontend and backend use different origins.

`vercel.json` builds the frontend only. Deploy the FastAPI backend separately, set `VITE_API_BASE_URL` in the frontend build environment, and set `SQUADPULSE_CORS_ORIGINS` on the backend to the exact frontend origin(s). The backend also accepts the optional server-side `GEMINI_API_KEY`; never put that secret in a `VITE_` variable. Examples are in `backend/.env.example` and `frontend/.env.example`.
