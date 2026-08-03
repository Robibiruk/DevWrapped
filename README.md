# DevWrapped — *Your Year in Code*

Turn a GitHub profile into a cinematic, shareable slide deck: commit psychology, tech DNA, your coding archetype, and a download/share finale.

## Repo layout

```
DevWrapper/
├── web/      # React 19 + Vite + TypeScript + Tailwind frontend (the deck)
└── worker/   # Cloudflare Worker proxy — holds one GitHub token, fetches + caches data
```

## Architecture

User enters a username → the worker (`GET /api/wrapped?username=X`) pulls profile, repos, language bytes, the contribution calendar (GraphQL), and sampled commit messages from GitHub, then caches the assembled payload per-username for 1 hour (Cache API). The frontend runs analysis + personality templates client-side and animates the deck.

The proxy exists because GitHub's GraphQL API requires a token, and unauthenticated REST (60 req/hr) is far too slow for the <10s generation target. One token behind the worker keeps per-user generation fast and rate-limit-safe.

## Setup

Prerequisites: Node 20+ and npm.

### 1. Worker — needs a GitHub token

1. Create a classic PAT (no scopes needed) at https://github.com/settings/tokens
2. `worker/.dev.vars` is already scaffolded — paste your token in:

```
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx
```

### 2. Web — env (already scaffolded in `web/.env`)

| Variable        | Default               | Purpose                                    |
| --------------- | --------------------- | ------------------------------------------ |
| `VITE_API_BASE` | `http://localhost:8787` | Worker URL the frontend calls             |
| `VITE_USE_MOCK` | unset                 | `1` renders the deck from built-in mock data (no token/network needed) |

## Run

```bash
# Terminal 1 — worker API (port 8787)
cd worker && npm run dev

# Terminal 2 — web app (http://localhost:5173)
cd web && npm run dev        # real data (token required)
cd web && VITE_USE_MOCK=1 npm run dev   # or mock data, no token
```

Open http://localhost:5173, enter a GitHub username, and press **→** to advance the deck.

## Build & check

```bash
cd web && npm run build      # production build → dist/
cd web && npm run typecheck  # tsc --noEmit
```

## Deploy

- **Worker**: `cd worker && npm run deploy`, then `wrangler secret put GITHUB_TOKEN` to set the production token.
- **Web**: point Cloudflare Pages at the repo, build command `npm run build`, output directory `dist` (run inside `web/`).
