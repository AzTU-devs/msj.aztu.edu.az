import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { api, Issue, ArticleSummary } from "@/lib/api";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://msj.aztu.edu.az";
const JOURNAL_NAME = "Machine Science";
const ISSN = ["2227-6912", "2790-0479"];
const PUBLISHER = "Azerbaijan Technical University";
const PUBLISHER_URL = "https://aztu.edu.az";

type IssuePayload = { issue: Issue; articles: ArticleSummary[] };

async function load(slug: string): Promise<IssuePayload | null> {
  try {
    return await api.issue(slug);
  } catch {
    return null;
  }
}

/** "Volume 12 · Number 2 · 2024" — only the parts that are present. */
function issueParts(issue: Issue): string {
  return [
    issue.volume != null ? `Volume ${issue.volume}` : null,
    issue.number != null ? `Number ${issue.number}` : null,
    issue.year ? String(issue.year) : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

function pagesLabel(a: ArticleSummary): string | null {
  if (a.pageStart == null) return null;
  return a.pageEnd != null && a.pageEnd !== a.pageStart
    ? `pp. ${a.pageStart}–${a.pageEnd}`
    : `p. ${a.pageStart}`;
}

function keywordList(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(/[,;]/)
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 4);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) return { title: "Issue not found" };
  const { issue } = data;

  const parts = issueParts(issue);
  const description =
    issue.description?.trim() ||
    `${JOURNAL_NAME}${parts ? ` — ${parts}` : ""}. Full table of contents, open-access articles and full-issue PDF.`;

  return {
    title: issue.title,
    description: description.slice(0, 200),
    alternates: { canonical: `/issues/${slug}` },
    openGraph: {
      type: "website",
      title: issue.title,
      description: description.slice(0, 200),
      url: `/issues/${slug}`,
      siteName: JOURNAL_NAME,
      locale: "en",
      ...(issue.coverUrl ? { images: [{ url: issue.coverUrl }] } : {}),
    },
    twitter: {
      card: issue.coverUrl ? "summary_large_image" : "summary",
      title: issue.title,
      description: description.slice(0, 200),
      ...(issue.coverUrl ? { images: [issue.coverUrl] } : {}),
    },
  };
}

export default async function IssuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) notFound();
  const { issue, articles } = data;

  const parts = issueParts(issue);

  // ---- structured data: PublicationIssue + breadcrumb -------------------
  const periodical = {
    "@type": "Periodical",
    name: JOURNAL_NAME,
    issn: ISSN,
    publisher: { "@type": "Organization", name: PUBLISHER, url: PUBLISHER_URL },
  };

  const publicationIssue: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "PublicationIssue",
    name: issue.title,
    inLanguage: "en",
    url: `${SITE_URL}/issues/${slug}`,
    ...(issue.number != null ? { issueNumber: issue.number } : {}),
    ...(issue.publishedAt ? { datePublished: issue.publishedAt } : {}),
    ...(issue.doi
      ? {
          sameAs: `https://doi.org/${issue.doi}`,
          identifier: { "@type": "PropertyValue", propertyID: "DOI", value: issue.doi },
        }
      : {}),
    isPartOf:
      issue.volume != null
        ? { "@type": "PublicationVolume", volumeNumber: issue.volume, isPartOf: periodical }
        : periodical,
    ...(articles.length
      ? {
          hasPart: articles.map((a) => ({
            "@type": "ScholarlyArticle",
            name: a.title,
            url: `${SITE_URL}/articles/${a.id}`,
            ...(a.authorNames?.length
              ? { author: a.authorNames.map((name) => ({ "@type": "Person", name })) }
              : {}),
            ...(a.doi ? { sameAs: `https://doi.org/${a.doi}` } : {}),
            ...(a.pageStart != null ? { pageStart: a.pageStart } : {}),
            ...(a.pageEnd != null ? { pageEnd: a.pageEnd } : {}),
          })),
        }
      : {}),
  };

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Archive", url: "/archive" },
    { name: issue.title, url: `/issues/${slug}` },
  ]);

  const metaRow: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "1.2rem",
    fontFamily: "var(--f-mono)",
    fontSize: ".72rem",
    letterSpacing: ".04em",
    color: "var(--ink-3)",
    marginTop: "1.3rem",
  };

  return (
    <main>
      <JsonLd data={[breadcrumb, publicationIssue]} />

      <section className="sec">
        <div className="wrap">
          <p className="annot" style={{ marginBottom: "1.4rem" }}>
            <Link href="/archive" style={{ textDecoration: "none", color: "inherit" }}>
              ← Archive
            </Link>
          </p>

          {/* ---- issue masthead: cover + title/description/actions ---- */}
          <div
            style={{
              display: "grid",
              gap: "clamp(1.6rem,4vw,3rem)",
              gridTemplateColumns: issue.coverUrl ? "minmax(0,1fr) clamp(140px,30%,240px)" : "1fr",
              alignItems: "start",
            }}
          >
            <div>
              <p className="annot">Issue{parts ? ` · ${parts}` : ""}</p>
              <h1 className="sec__title">{issue.title}</h1>

              {issue.description && <p className="sec__lede">{issue.description}</p>}

              <div style={metaRow}>
                {issue.publishedAt && <span>Published {issue.publishedAt}</span>}
                <span>
                  {articles.length} {articles.length === 1 ? "article" : "articles"}
                </span>
                {issue.doi && (
                  <a
                    href={`https://doi.org/${issue.doi}`}
                    target="_blank"
                    rel="noopener"
                    style={{ color: "var(--annot)", textDecoration: "none" }}
                  >
                    https://doi.org/{issue.doi}
                  </a>
                )}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: ".8rem", marginTop: "1.9rem" }}>
                {issue.fullPdfUrl && (
                  <a className="btn btn--fill" href={issue.fullPdfUrl} target="_blank" rel="noopener">
                    <span>Download full issue (PDF)</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3v13M6 11l6 6 6-6M4 21h16" />
                    </svg>
                  </a>
                )}
                <Link className="btn btn--line" href="/archive">
                  <span>Browse the archive</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12h15M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </div>

            {issue.coverUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={issue.coverUrl}
                alt={`Cover of ${issue.title}`}
                loading="lazy"
                decoding="async"
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  borderRadius: "4px",
                  border: "1px solid var(--rule)",
                  boxShadow: "var(--shadow)",
                  background: "var(--panel)",
                }}
              />
            )}
          </div>

          {/* ---- table of contents ---- */}
          <div style={{ marginTop: "clamp(2.6rem,6vw,4rem)" }}>
            <p className="annot" style={{ marginBottom: "1.6rem" }}>
              Table of contents
            </p>

            {articles.length === 0 ? (
              <p className="sec__lede" style={{ marginTop: 0 }}>
                Articles for this issue will appear here once published.
              </p>
            ) : (
              <div className="arts">
                {articles.map((a) => {
                  const field = [a.subjectArea, pagesLabel(a)].filter(Boolean).join(" · ");
                  const keys = keywordList(a.keywords);
                  return (
                    <Link className="art" key={a.id} href={`/articles/${a.id}`}>
                      {field && <div className="art__field">{field}</div>}
                      <h3 className="art__title">{a.title}</h3>
                      {a.authorNames?.length > 0 && (
                        <p className="art__auth">{a.authorNames.join(", ")}</p>
                      )}
                      {keys.length > 0 && (
                        <div className="art__keys">
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
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
