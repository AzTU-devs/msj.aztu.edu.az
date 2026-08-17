# msj-web

Public website for the **Machine Science** journal — Next.js 16 (App Router, React 19), server-rendered.

| | |
|---|---|
| Site | https://msj.aztu.edu.az |
| API | https://api-msj.aztu.edu.az |
| Portal (submission / sign-in) | https://admin-msj.aztu.edu.az |

## Run

```bash
cp .env.example .env.local     # then point the API vars at a local backend
npm install
npm run dev                    # http://localhost:3000
npm run build && npm run start # production
npm run typecheck              # tsc --noEmit
```

All three hosts are declared once in [`lib/site.ts`](lib/site.ts). `NEXT_PUBLIC_*`
values are **inlined at build time** — set them before `next build`, not at
`docker run`.

## Routes

| Route | What it is |
|---|---|
| `/` | Hero → credentials rail → current issue (cover, record, contents) → quick actions → about + journal record → scope → announcements → open calls → editorial board → archive preview → contact |
| `/about` `/scope` `/board` `/contact` | Section pages, all opening on the shared page-header band |
| `/authors` | **Information for Authors** hub — the three guidance pages, then the process and terms |
| `/authors/manuscript` | Preparation of Manuscript — subject areas, type of work, formatting, 12-point checklist |
| `/authors/open-access` | Open access policies — Gold OA, CC licensing, embargo, sharing, preprints |
| `/authors/ai-policy` | AI Policy — risks, author duties and disclosure, images, editors and peer reviewers |
| `/archive` | Every issue as a cover grid, grouped by year |
| `/issues/[slug]` | Issue cover + record + full table of contents + prev/next issue |
| `/articles/[id]` | Paper: abstract, keywords, affiliations, and a sticky rail with PDF, metrics, identifiers, citation export (plain/BibTeX/RIS) and share |
| `/search` | Full-text article search over `GET /articles?q=`, paginated |
| `/sitemap.xml` `/robots.txt` `/manifest.webmanifest` `/opengraph-image` | Generated |

## Layout system

- **`app/design.css`** — the original design draft: palette tokens (dark/light),
  the type scale, the three inlined variable fonts (Archivo, Source Serif 4,
  IBM Plex Mono, base64 woff2), and the first-generation component primitives.
- **`app/layout.css`** — loaded second. The page furniture: utility strip,
  search overlay, page-header band with breadcrumbs, issue spotlight, table of
  contents, quick-action cards, announcements, archive grid, four-column
  footer, and the two-column article shell. It overrides a small number of
  design.css rules (nav drawer, footer); each such block says so.
- **`app/articles/[id]/article.css`** — route-scoped extras only.

Shared components live in `components/`: `PageHeader`, `Breadcrumbs`,
`IssueCover` (falls back to a *typeset* cover built from the issue record when
there is no scan), `Toc`, `CiteCard`, `ShareRow`, `icons.tsx` (one icon set for
the whole site), `scopeIcons.tsx`.

## SEO

Everything below is emitted server-side, in the initial HTML.

- **Structured data** (`lib/seo.ts`) — `WebSite` with a `SearchAction`
  (sitelinks search box), `Organization`, `Periodical`, `ScholarlyArticle`
  (with `isAccessibleForFree`, `license`, ORCID `sameAs`), `PublicationIssue`
  with `hasPart`, `CollectionPage`, `ItemList` (archive, board) and
  `BreadcrumbList` on every page. Nodes cross-reference by `@id`.
- **Bibliographic meta tags** — Google Scholar / Crossref `citation_*` (with
  `citation_author_institution` interleaved per author, and
  `citation_fulltext_world_readable`), Dublin Core `dc.*` for OAI harvesters,
  and PRISM `prism.*` for abstracting services.
- **Canonicals** on every route; `robots: noindex` on `/search` and the 404.
- **`sitemap.ts`** — static routes plus every issue and article, with issue
  cover images and priority decaying from the current issue to the back run.
- **`robots.ts`** — disallows `/search` and `/api/`, but lets Googlebot reach
  `/api/v1/articles/*/pdf` so the Scholar `[PDF]` link resolves.
- **`opengraph-image.tsx`** — generated 1200×630 share card in the journal's
  palette; issues and articles override it with the issue cover.
- Generated `icon.svg`, `manifest.webmanifest`, theme colour, visible
  breadcrumbs, a skip link, `not-found.tsx`, and `fetchPriority="high"` on the
  hero LCP frame.

Search-console tokens are read from `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`,
`NEXT_PUBLIC_BING_VERIFICATION`, `NEXT_PUBLIC_YANDEX_VERIFICATION`; unset
variables emit no tag.

## Data

`lib/api.ts` is the typed client. Almost the whole public site is driven by one
aggregate call, `GET /api/v1/home` (settings, texts, hero slides, scope topics,
author steps/terms, board, announcements, current issue, archive, open calls).
Every page wraps its fetch in `try/catch` and degrades to a complete
empty-state, so a backend outage never fails a build or blanks a page.

`next.config.mjs` proxies `/api/*` and `/files/*` to the backend so browser
traffic stays same-origin (no CORS), and sets the baseline security headers.

## Responsive

The layout is checked at 320 / 360 / 390 / 480 / 640 / 768 / 900 / 1024 / 1280 /
1440 / 1920 and in landscape on short viewports. Two rules make it hold:

- Every `repeat(auto-fill, minmax(N, 1fr))` uses `minmax(min(N, 100%), 1fr)`.
  A bare `minmax(330px, 1fr)` does **not** collapse below 330px — it overflows,
  and `body { overflow-x: hidden }` then hides the symptom by cutting the page
  off instead of reflowing it.
- The header sheds in a defined order as it narrows: nav → drawer at 1260,
  utility links at 980, brand subtitle at 820, the Submit button at 560, the
  AZ/EN toggle at 480, brand wordmark shrinks at 380.

Sticky rails (`.apg__side`, `.spot__aside`) go static under 640px and on short
landscape viewports, where a sticky column would eat the screen.

## Docker

One command, from a clean checkout, to rebuild and restart against the
production API:

```bash
git pull --ff-only origin main \
 && docker build \
      --build-arg API_URL=https://api-msj.aztu.edu.az \
      --build-arg NEXT_PUBLIC_API_URL=https://api-msj.aztu.edu.az \
      --build-arg NEXT_PUBLIC_SITE_URL=https://msj.aztu.edu.az \
      --build-arg NEXT_PUBLIC_ADMIN_URL=https://admin-msj.aztu.edu.az \
      -t msj-web:latest . \
 && docker rm -f msj-web 2>/dev/null; \
    docker run -d --name msj-web --restart unless-stopped \
      -p 3000:3000 \
      -e API_URL=https://api-msj.aztu.edu.az \
      msj-web:latest \
 && docker logs -f --tail 50 msj-web
```

The `NEXT_PUBLIC_*` values must be **build args**, not just runtime `-e` flags —
they are inlined into the client bundle by `next build`. `API_URL` is passed
both ways because it is baked into the `/api` + `/files` rewrites at build time
*and* read by server components at request time.

## Remaining

- Wire "Download PDF" to fire a `PDF_DOWNLOAD` beacon once file storage is live.
- Announcements have no detail route yet — the homepage clamps the body.
- Full AZ/EN/RU routing via `next-intl` if server-side locale URLs are wanted
  (the header's AZ/EN toggle is currently a no-op).
- `design.css` still carries the superseded `.iss*`, `.arch-yr*`, `.art`/`.arts`
  and `.fig*` rules, now unused — safe to prune in a pass with a build handy.
