import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { api, ArticleDetail, Issue } from "@/lib/api";
import { articleJsonLd, breadcrumbJsonLd, scholarMeta, JsonLd } from "@/lib/seo";
import MetricBeacon from "@/components/MetricBeacon";
import "./article.css";

async function load(id: string): Promise<ArticleDetail | null> {
  try {
    return await api.article(id);
  } catch {
    return null;
  }
}

/** Resolve the parent issue (for citation volume/issue + breadcrumb) by id. */
async function loadIssue(issueId: number | null): Promise<Issue | null> {
  if (issueId == null) return null;
  try {
    const issues = await api.issues();
    return issues.find((it) => it.id === issueId) ?? null;
  } catch {
    return null;
  }
}

/** Collapse whitespace and trim an abstract to a word-boundary meta description. */
function metaDescription(text: string | null | undefined): string | undefined {
  if (!text) return undefined;
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 200) return clean;
  const cut = clean.slice(0, 200);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 120 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const a = await load(id);
  if (!a) return { title: "Article not found", robots: { index: false, follow: false } };

  const description = metaDescription(a.abstractText);
  const canonical = `/articles/${a.id}`;
  const authors = a.authors.map((au) => `${au.firstName} ${au.lastName}`.trim()).filter(Boolean);

  return {
    title: a.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: a.title,
      description,
      url: canonical,
      siteName: "Machine Science",
      ...(a.publishedAt ? { publishedTime: a.publishedAt } : {}),
      ...(authors.length ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: a.title,
      description,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await load(id);
  if (!a) notFound();

  const issue = await loadIssue(a.issueId);
  const pdfUrl = `/api/v1/articles/${a.id}/pdf`;

  // Google Scholar / Crossref highwire citation tags — React 19 hoists <meta> to <head>.
  const citationTags = scholarMeta(a, issue, pdfUrl);

  const breadcrumb = [
    { name: "Home", url: "/" },
    { name: "Archive", url: "/archive" },
    ...(issue ? [{ name: issue.title, url: `/issues/${issue.slug}` }] : []),
    { name: a.title, url: `/articles/${a.id}` },
  ];

  return (
    <>
      {citationTags.map((m) => (
        <meta key={m.name + m.content} name={m.name} content={m.content} />
      ))}
      <JsonLd data={[articleJsonLd(a, issue), breadcrumbJsonLd(breadcrumb)]} />

      <main className="art-page">
        <MetricBeacon articleId={a.id} type="FULLTEXT_VIEW" />
        <div className="art-wrap">
          <Link className="art-back" href="/archive">← Archive</Link>

          {a.subjectArea && <div className="art-kicker">{a.subjectArea}</div>}
          <h1 className="art-title">{a.title}</h1>

          <div className="art-authors">
            {a.authors.map((au, i) => (
              <span key={i} className="art-author">
                {au.firstName} {au.lastName}
                {au.corresponding ? <span className="art-corr" title="Corresponding author">✉</span> : null}
                {i < a.authors.length - 1 ? "; " : ""}
              </span>
            ))}
          </div>

          <div className="art-meta">
            {a.doi && (
              <a href={`https://doi.org/${a.doi}`} target="_blank" rel="noopener">
                https://doi.org/{a.doi}
              </a>
            )}
            {a.pageStart && <span>pp. {a.pageStart}–{a.pageEnd}</span>}
            {a.publishedAt && <span>{a.publishedAt}</span>}
          </div>

          {a.authors.some((au) => au.email) && (
            <section className="art-section">
              <h2>E-mails</h2>
              <ul className="art-emails">
                {a.authors.filter((au) => au.email).map((au, i) => (
                  <li key={i}><a href={`mailto:${au.email}`}>{au.email}</a></li>
                ))}
              </ul>
            </section>
          )}

          <div className="art-metrics" aria-label="Article metrics">
            <div className="art-metric"><b>{a.metrics.views.toLocaleString()}</b><span>Views</span></div>
            <div className="art-metric"><b>{a.metrics.downloads.toLocaleString()}</b><span>Downloads</span></div>
            <div className="art-metric"><b>{a.metrics.citations.toLocaleString()}</b><span>Citations</span></div>
          </div>

          {a.abstractText && (
            <section className="art-section">
              <h2>Abstract</h2>
              <p>{a.abstractText}</p>
            </section>
          )}

          {a.keywords && (
            <section className="art-section">
              <h2>Keywords</h2>
              <p className="art-keywords">{a.keywords}</p>
            </section>
          )}

          <div className="art-actions">
            <a className="art-btn" href={pdfUrl}>Download PDF</a>
          </div>
        </div>
      </main>
    </>
  );
}
