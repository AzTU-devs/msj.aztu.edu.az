import type { Metadata } from "next";
import Link from "next/link";
import { api, type ArticleSummary, type Page } from "@/lib/api";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import { authorLine, pagesLabel, parseKeywords } from "@/lib/journal";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { IconArrow, IconSearch } from "@/components/icons";

const SIZE = 12;

export const metadata: Metadata = {
  title: "Search",
  description: "Search every article published in Machine Science by title, author or keyword.",
  alternates: { canonical: "/search" },
  // Result pages are query-parameter permutations of the archive; the archive
  // and the article pages are the canonical things to index, not these.
  robots: { index: false, follow: true },
};

type Params = { q?: string; p?: string };

async function search(q: string, page: number): Promise<Page<ArticleSummary> | null> {
  try {
    return await api.articles({ ...(q ? { q } : {}), page, size: SIZE });
  } catch {
    return null;
  }
}

/** Page numbers to render: first, last, and a window around the current one. */
function pageWindow(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const out = new Set<number>([0, total - 1, current]);
  for (let d = 1; d <= 2; d++) {
    if (current - d >= 0) out.add(current - d);
    if (current + d < total) out.add(current + d);
  }
  const sorted = Array.from(out).sort((a, b) => a - b);
  const withGaps: (number | "gap")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - (sorted[i - 1] as number) > 1) withGaps.push("gap");
    withGaps.push(n);
  });
  return withGaps;
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  // The URL carries a human page number; the API is zero-based.
  const human = Math.max(1, Number.parseInt(sp.p ?? "1", 10) || 1);
  const result = await search(q, human - 1);

  const items = result?.content ?? [];
  const total = result?.totalElements ?? 0;
  const totalPages = result?.totalPages ?? 0;
  const href = (n: number) => `/search?${q ? `q=${encodeURIComponent(q)}&` : ""}p=${n + 1}`;

  const lede = q
    ? total > 0
      ? `${total} ${total === 1 ? "article matches" : "articles match"} “${q}”.`
      : `Nothing in the archive matches “${q}”.`
    : "Search every article published in Machine Science by title, author or keyword.";

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Search", url: "/search" },
        ])}
      />
      <Reveal />
      <noscript>
        <style>{`.rv{opacity:1 !important;transform:none !important;}`}</style>
      </noscript>

      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Search" }]}
        eyebrow="Search"
        title={q ? "Search results" : "Search the archive"}
        lede={lede}
        actions={
          /* A plain GET form: it works with JavaScript off and it is the same
             endpoint the header's search panel posts to. */
          <form className="srch__form" action="/search" method="get" role="search" style={{ width: "min(620px,100%)" }}>
            <IconSearch className="srch__ic" />
            <input
              className="srch__in"
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Title, author, keyword…"
              aria-label="Search query"
              autoComplete="off"
            />
            <button className="srch__go" type="submit">
              Search
            </button>
          </form>
        }
      />

      <section className="sec">
        <div className="wrap">
          {!result ? (
            <div className="empty rv">
              <p className="empty__t">Search is temporarily unavailable</p>
              <p className="empty__d">
                The article index could not be reached. The <Link href="/archive">archive</Link> lists every issue in
                the meantime.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="empty rv">
              <p className="empty__t">{q ? "No matching articles" : "Start with a title, author or keyword"}</p>
              <p className="empty__d">
                {q
                  ? "Try a broader term, an author surname, or browse the archive issue by issue."
                  : "Every article published since 2001 is indexed — search by a paper's title, one of its authors, or a subject keyword."}
              </p>
              <p style={{ marginTop: "1.6rem" }}>
                <Link className="btn btn--line" href="/archive">
                  <span>Browse the archive</span>
                  <IconArrow />
                </Link>
              </p>
            </div>
          ) : (
            <>
              <div className="results rv">
                {items.map((a) => {
                  const keys = parseKeywords(a.keywords, 3);
                  const meta = [a.subjectArea, pagesLabel(a), a.publishedAt?.slice(0, 4)].filter(Boolean);
                  return (
                    <Link className="result" href={`/articles/${a.id}`} key={a.id}>
                      <div className="result__k">
                        {meta.join(" · ")}
                        {a.doi ? (
                          <>
                            {meta.length > 0 ? " · " : ""}
                            <b>doi.org/{a.doi}</b>
                          </>
                        ) : null}
                      </div>
                      <h2 className="result__t">{a.title}</h2>
                      {a.authorNames?.length > 0 && <p className="result__a">{authorLine(a.authorNames)}</p>}
                      {keys.length > 0 && (
                        <div className="art__keys" style={{ marginTop: ".7rem" }}>
                          {keys.map((k) => (
                            <span className="key" key={k}>
                              {k}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <nav className="pager" aria-label="Search results pages">
                  {human > 1 && <Link href={href(human - 2)}>Prev</Link>}
                  {pageWindow(human - 1, totalPages).map((n, i) =>
                    n === "gap" ? (
                      <span className="pager__gap" key={`gap-${i}`}>
                        …
                      </span>
                    ) : n === human - 1 ? (
                      <span key={n} aria-current="page">
                        {n + 1}
                      </span>
                    ) : (
                      <Link key={n} href={href(n)}>
                        {n + 1}
                      </Link>
                    )
                  )}
                  {human < totalPages && <Link href={href(human)}>Next</Link>}
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
