# msj-web

Public website for the Machine Science journal — Next.js 16 (App Router, React 19).

## Run

```bash
cp .env.example .env.local     # API_URL + NEXT_PUBLIC_API_URL -> backend
npm install
npm run dev                    # http://localhost:3000
npm run build && npm run start # production
```

## What's here

- **Homepage** (`app/page.tsx` → `components/DesignHome.tsx`) — a faithful
  reproduction of the approved design: exact CSS (`app/design.css`, fonts inlined),
  hero slider with the animated gear canvas, i18n (AZ/EN), theme toggle, editorial
  board with real portraits. Board photos and hero slides are served from
  `public/media/`.
- **Article pages** (`app/articles/[id]/page.tsx`) — **server-rendered** from the
  live API, with `generateMetadata` emitting Google-Scholar/Crossref `citation_*`
  meta tags (title, authors, DOI, ISSN, dates, pages) — the reason for choosing SSR.
  A `MetricBeacon` client component records a `FULLTEXT_VIEW` on load.
- `lib/api.ts` — typed client for the backend (board, issues, articles, settings, pages).
- `next.config.mjs` — proxies `/api/*` to the backend so metric posts and client
  fetches are same-origin.

## Remaining

- Port the remaining static sections (scope, authors' guidelines, contact form
  submit) to pull `content_pages`/`settings` from the API instead of the embedded
  copy (the copy is already the real journal text).
- Dedicated **issue/archive** and **search** pages (API endpoints already exist:
  `GET /issues`, `/issues/{slug}`, `/articles?q=&subject=&issueId=`).
- Wire the "Download PDF" button to `/api/v1/articles/{id}/pdf` once file storage
  is implemented, firing a `PDF_DOWNLOAD` beacon.
- Full AZ/EN/RU routing via `next-intl` if server-side locale URLs are wanted.

## Docker (independent deploy)

This app is self-contained and deploys on its own:

```bash
# API_URL is baked into the /api + /files proxy rewrites at build time.
docker build --build-arg API_URL=https://api.your-domain.com -t msj-web .
docker run -p 3000:3000 -e API_URL=https://api.your-domain.com msj-web
```

Browsers stay same-origin: the Next server proxies `/api` and `/files` to the
backend, so no CORS is needed. `NEXT_PUBLIC_API_URL` can be set to call the
backend directly instead (then configure the backend's `CORS_ORIGINS`).
