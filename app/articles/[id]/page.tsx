import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { api, ArticleDetail } from "@/lib/api";
import MetricBeacon from "@/components/MetricBeacon";
import "./article.css";

async function load(id: string): Promise<ArticleDetail | null> {
  try {
    return await api.article(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const a = await load(id);
  if (!a) return { title: "Article not found" };

  // Google Scholar / Crossref "highwire" citation tags — the reason for SSR.
  const other: Record<string, string | string[]> = {
    citation_title: a.title,
    citation_journal_title: "Machine Science",
    citation_issn: "2790-0479",
    citation_publisher: "Azerbaijan Technical University",
    citation_author: a.authors.map((au) => `${au.lastName}, ${au.firstName}`),
  };
  if (a.doi) other.citation_doi = a.doi;
  if (a.publishedAt) other.citation_publication_date = a.publishedAt.replaceAll("-", "/");
  if (a.pageStart) other.citation_firstpage = String(a.pageStart);
  if (a.pageEnd) other.citation_lastpage = String(a.pageEnd);

  return {
    title: a.title,
    description: a.abstractText?.slice(0, 200),
    other,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await load(id);
  if (!a) notFound();

  return (
    <main className="art-page">
      <MetricBeacon articleId={a.id} type="FULLTEXT_VIEW" />
      <div className="art-wrap">
        <Link className="art-back" href="/#archive">← Archive</Link>

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
          <a className="art-btn" href={`/api/v1/articles/${a.id}/pdf`}>Download PDF</a>
        </div>
      </div>
    </main>
  );
}
