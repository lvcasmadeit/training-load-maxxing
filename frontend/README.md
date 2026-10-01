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
- `src/features/home/` — coach-focused marketing landing page.
- `src/features/team/` — three-pane workspace with a toggleable roster and insights panel.
- `src/features/athlete/` — selected athlete metrics and workload history.
- `src/features/insights/` — scrollable athlete insights and Markdown rendering.
- `src/shared/components/` — shared navigation and UI components.
- `src/utils/api.js` — browser API client.
- `src/index.css` — global and responsive styles.

## Routes

- `/` — Squad Pulse landing page; “Explore the demo” opens the workspace.
- `/team` — team workspace, initially selecting the first athlete.
- `/team/:id` — team workspace focused on the selected athlete.

The workspace presents the roster on the left, athlete details in the main pane, and athlete insights on the right. The roster and insights panes can be hidden from the workspace toolbar; on narrow screens, open one panel at a time.

## API configuration

The browser API base defaults to `/api`, which works with the local Vite proxy and same-origin production routing. To call a separately hosted API, set `VITE_API_BASE_URL` to its public base URL, including `/api` (for example, `https://api.example.com/api`).

For local development, `VITE_API_PROXY_TARGET` changes the Vite proxy target; its default is `http://localhost:8000`. Put local overrides in an untracked `.env.local` file. `VITE_` variables are included in browser code and **must not contain secrets**.

The frontend deployment configuration in the repository builds only this application. The FastAPI backend must be deployed separately unless the hosting setup adds an API proxy/rewrite.
