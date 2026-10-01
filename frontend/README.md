# Squad Pulse frontend

React 18 and Vite client for the Squad Pulse demo. The UI reads its data from the FastAPI backend; the current demo data is synthetic rather than streamed from a wearable.

## Setup

```bash
npm ci
npm run dev
```

Vite prints the local URL (normally `http://localhost:5173`). The backend should be running at `http://localhost:8000`; the Vite development server proxies `/api` requests there by default.

## Available scripts

- `npm run dev` — start the local Vite server.
- `npm run lint` — run ESLint.
- `npm run build` — create the production bundle in `dist/`.
- `npm run preview` — serve the built frontend locally.

## Source layout

- `src/app/` — application shell and route declarations.
- `src/features/home/`, `src/features/team/`, `src/features/athlete/`, `src/features/insights/` — feature-specific pages and UI.
- `src/shared/components/` — components shared across features.
- `src/utils/api.js` — browser API client.
- `src/index.css` — global styles.

## Routes

- `/` — home page.
- `/team` — team overview.
- `/team/:id` — athlete details and insights.

## API configuration

The browser API base defaults to `/api`, which works with the local Vite proxy and same-origin production routing. To call a separately hosted API, set `VITE_API_BASE_URL` to its public base URL, including `/api` (for example, `https://api.example.com/api`).

For local development, `VITE_API_PROXY_TARGET` changes the Vite proxy target; its default is `http://localhost:8000`. Put local overrides in an untracked `.env.local` file. `VITE_` variables are included in browser code and **must not contain secrets**.

The frontend deployment configuration in the repository builds only this application. The FastAPI backend must be deployed separately unless the hosting setup adds an API proxy/rewrite.
