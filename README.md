# foundit-fe-next

Next.js 15 (App Router) migration of the Angular `FOUNDIT_FE` app.
See [`MIGRATION.md`](./MIGRATION.md) for the full Angular → Next.js mapping and
phase plan.

## Stack

- Next.js 15 + React 19 (App Router, `src/` dir, `@/*` import alias)
- TypeScript
- Tailwind CSS v4 (same engine as the Angular app)
- axios + @tanstack/react-query (services / data fetching)
- @stomp/stompjs + sockjs-client (realtime chat, Phase 6)

## Getting started

```bash
# 1. install dependencies
npm install

# 2. (already created) confirm .env.local points at the backend
#    NEXT_PUBLIC_API_URL=http://localhost:8085
#    NEXT_PUBLIC_WS_URL=http://localhost:8085/ws

# 3. run the dev server
npm run dev
```

Open http://localhost:3000 — you should see the Phase 0 placeholder landing page.

> The backend `FOUNDIT_BE` (Spring Boot, port 8085) must be running for API
> calls to work in later phases.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |

## Project layout

```
foundit-fe-next/
├─ public/
│  ├─ assets/images/...        # ported from FOUNDIT_FE/src/assets/images
│  ├─ assets/videos/...        # ported from FOUNDIT_FE/src/assets/videos
│  └─ favicon.ico, *.svg       # ported from FOUNDIT_FE/public
├─ src/
│  └─ app/
│     ├─ layout.tsx            # root layout (Angular index.html + AppComponent)
│     ├─ globals.css           # Tailwind v4 + AOS
│     └─ page.tsx              # landing placeholder (real UI in Phase 3)
├─ .env.local                  # backend URLs (from Angular env.ts)
├─ next.config.ts              # image host + dev proxy
└─ MIGRATION.md                # migration plan & mapping
```
