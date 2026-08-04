<div align="center">

# DevWrapped

### *Your Year in Code.*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000?logo=vercel&logoColor=white)](https://devwrapped.vercel.app)
[![API on Cloudflare Workers](https://img.shields.io/badge/API-Cloudflare%20Workers-F48120?logo=cloudflare&logoColor=white)](https://devwrapped-api.robekmedia-723.workers.dev)
[![Built with React](https://img.shields.io/badge/Built%20with-React%20%2B%20Vite-61DAFB?logo=react&logoColor=white)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

> Turn a GitHub profile into a cinematic, interactive story.  
> Not another dashboard. A **Wrapped**.

[**Try it live →**](https://devwrapped.vercel.app)

---

![Hero Screenshot](screenshots/hero.png)

</div>

---

## What is DevWrapped?

Spotify Wrapped went viral because it wasn't analytics — it was **storytelling**.

GitHub has millions of developers, yet every recap tool today is just a dashboard wearing colorful clothes.

DevWrapped changes that. Enter a username. Get a **10-slide cinematic deck** that tells the story behind your year as a developer — what you built, when you coded, how you think, and what your commit history secretly says about you.

---

## Features

### The Deck — 10 slides, one story

| # | Slide | What it shows |
|---|-------|---------------|
| 1 | **Opening** | Animated reveal with your avatar and "Your 2026 in Code" |
| 2 | **Year in Numbers** | Commits, repos, PRs, issues, stars, followers — count-up animation |
| 3 | **Tech DNA** | Your language breakdown as an animated genome visualization |
| 4 | **Commit Psychology** | "You typed 'fix' 48 times." — what your messages really say |
| 5 | **Project Graveyard** | Created 22 repos, maintained 4. The rest are enjoying retirement. |
| 6 | **Peak Moment** | Your hardest coding day — 47 commits, 3 repos, 9 hours |
| 7 | **The Night Owl** | Latest commit at 2:00 AM — "please work" |
| 8 | **Hall of Fame** | Most starred, most active, longest-running, fastest-growing |
| 9 | **Developer Archetype** | The Explorer, The Finisher, The Night Owl — personality from data |
| 10 | **Share Studio** | 6 stat cards + all-in-one poster,8 theme packs, download/share |

### Theme Packs — your Wrapped, your style

Each theme changes the card surfaces, colors, typography, and decorative effects:

| Theme | Vibe | Best for |
|-------|------|----------|
| 🌌 **Neon Observatory** | Aurora gradients, stars, glassmorphism | Default / signature look |
| 🎵 **Wrapped Classic** | Bold gradients, giant typography | Familiar, highly shareable |
| ⚫ **Midnight Minimal** | Black, white, subtle accents | LinkedIn, professional |
| 🛰 **Cyber Terminal** | CRT, monospace, scanlines | Developers, open-source |
| 🌍 **Open Source Universe** | Repos as planets, stars as commits | Creative storytelling |
| 📐 **Blueprint** | Engineering grids, paper texture | Engineers, architects |
| 🎮 **Pixel Arcade** | Retro 8-bit, chunky neon | Gamers, nostalgic |
| 💎 **Glass Aurora** | Frosted glass, liquid gradients | Premium, modern |

### Interactions

- **3D Tilt** — cards tilt toward your cursor with a holo shine, pointer-following glow, and a `</>` code watermark
- **Mobile Gyro** — tilt your phone and the card responds (gyroscope on Android, tap-to-activate on iOS)
- **Touch Swipe** — swipe cards in the Share Studio
- **Tap to Navigate** — tap right half of screen to advance, left half to go back
- **Theme Switching** — real-time theme swap with live card transition
- **PNG Export** — download any stat card or the all-in-one poster at 1080px resolution
- **Clipboard + Share** — copy to clipboard or native share sheet (where supported)

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                    Browser                       │
│                                                  │
│  React 19 + Vite + Tailwind                      │
│  ├── Landing Page (username input)               │
│  ├── 10-slide Deck (Framer Motion)               │
│  ├── Share Studio (theme picker + carousel)      │
│  └── WrappedPoster (all-in-one stat card)        │
│         │                                        │
│         ▼ fetch()                                │
│  ┌──────────────────────────────────┐            │
│  │  Cloudflare Worker (API proxy)   │            │
│  │  ├── GitHub REST API             │            │
│  │  ├── GitHub GraphQL API          │            │
│  │  └── Cache API (1h per user)     │            │
│  └──────────────────────────────────┘            │
└─────────────────────────────────────────────────┘
```

**Why a proxy?** GitHub's GraphQL API requires a token, and unauthenticated REST (60 req/hr) is too slow. One token behind the worker keeps generation fast (< 30s cold, < 1s cached) without exposing the token to the browser.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 · Vite · TypeScript · Tailwind CSS |
| Animation | Framer Motion |
| State | Zustand · TanStack Query |
| Effects | html-to-image · Custom tilt/holo engine |
| API Proxy | Cloudflare Workers (Cache API) |
| Hosting | Vercel (web) + Cloudflare Workers (API) |

---

## Getting Started

### Prerequisites

- Node 20+ and npm
- A GitHub account (for the token)

### 1. Create a GitHub Token

Go to [github.com/settings/tokens](https://github.com/settings/tokens) → Generate a classic token → select **`public_repo`** scope. No other scopes needed.

### 2. Set the Token

```bash
cd worker
cp .dev.vars.example .dev.vars
# Paste your token into .dev.vars:
# GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxx
```

### 3. Run Locally

```bash
# Terminal 1 — API proxy (port 8787)
cd worker && npm run dev

# Terminal 2 — web app (http://localhost:5173)
cd web && npm run dev
```

Open [http://localhost:5173](http://localhost:5173), enter a GitHub username, and press **→** to start.

> **No token?** Run `VITE_USE_MOCK=1 npm run dev` in `web/` to see the deck with built-in mock data.

---

## Deploy

### Worker (Cloudflare Workers)

```bash
cd worker
npm run deploy
wrangler secret put GITHUB_TOKEN  # paste your token at the prompt
```

### Web (Vercel)

1. Push to GitHub
2. [vercel.com/new](https://vercel.com/new) → Import `Robibiruk/DevWrapper`
3. Root directory: `web` · Build command: `npm run build` · Output: `dist`
4. Environment variable: `VITE_API_BASE` → your worker URL
5. Deploy → get `devwrapped.vercel.app`

---

## Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `GITHUB_TOKEN` | Worker secret | GitHub PAT (classic, `public_repo` scope) |
| `VITE_API_BASE` | Web `.env.production` | Worker API URL (baked at build time) |
| `VITE_USE_MOCK` | Web `.env` | Set to `1` for mock data (no token needed) |

---

## Project Structure

```
DevWrapper/
├── web/
│   ├── src/
│   │   ├── components/   # Deck, slides, ShareStudio, CardEffects
│   │   ├── pages/        # Landing, Wrapped
│   │   ├── lib/          # analysis, personality, tilt, themes, API
│   │   ├── store/        # Zustand deck state
│   │   └── hooks/        # TanStack Query data fetching
│   ├── public/favicon/   # SVG + PNG icons
│   └── vercel.json       # SPA routing config
└── worker/
    └── src/index.ts      # Cloudflare Worker (GitHub proxy + cache)
```

---

## License

MIT
