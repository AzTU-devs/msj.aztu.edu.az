import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { api, type ArticleSummary, type Issue } from "@/lib/api";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import {
  ISSN_ONLINE,
  ISSN_PRINT,
  JOURNAL_NAME,
  PUBLISHER,
  PUBLISHER_URL,
  formatDate,
  issueLabel,
  issueParts,
  toRoman,
} from "@/lib/journal";
import PageHeader from "@/components/PageHeader";
import IssueCover from "@/components/IssueCover";
import Toc from "@/components/Toc";
import Reveal from "@/components/Reveal";
import { IconArrow, IconDownload } from "@/components/icons";
import { SITE_URL } from "@/lib/site";

const ISSN = [ISSN_PRINT, ISSN_ONLINE];

type IssuePayload = { issue: Issue; articles: ArticleSummary[] };

async function load(slug: string): Promise<IssuePayload | null> {
  try {
    return await api.issue(slug);
  } catch {
    return null;
  }
}

/** The neighbouring issues, so a reader can walk the run without going back to the archive. */
async function neighbours(issue: Issue): Promise<{ prev: Issue | null; next: Issue | null }> {
  try {
    const all = await api.issues();
    const ordered = all
      .slice()
      .sort((a, b) => (a.year ?? 0) - (b.year ?? 0) || (a.number ?? 0) - (b.number ?? 0));
    const i = ordered.findIndex((it) => it.id === issue.id);
    if (i < 0) return { prev: null, next: null };
    return { prev: ordered[i - 1] ?? null, next: ordered[i + 1] ?? null };
  } catch {
    return { prev: null, next: null };
  }
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

export default async function IssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await load(slug);
  if (!data) notFound();
  const { issue, articles } = data;
  const { prev, next } = await neighbours(issue);

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

  return (
    <main>
      <JsonLd data={[breadcrumb, publicationIssue]} />
      <Reveal />
      <noscript>
        <style>{`.rv{opacity:1 !important;transform:none !important;}`}</style>
      </noscript>

      <PageHeader
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Archive", href: "/archive" },
          { name: issue.title },
        ]}
        eyebrow={parts ? `Issue · ${parts}` : "Issue"}
        title={issue.title}
        plain
        lede={issue.description || undefined}
        meta={
          <>
            {issue.publishedAt && <span>Published {formatDate(issue.publishedAt)}</span>}
            <span>
              <b>{articles.length}</b> {articles.length === 1 ? "article" : "articles"}
            </span>
            <span>Open access · CC BY 4.0</span>
            {issue.doi && (
              <a href={`https://doi.org/${issue.doi}`} target="_blank" rel="noopener">
                doi.org/{issue.doi}
              </a>
            )}
          </>
        }
        actions={
          <>
            {issue.fullPdfUrl && (
              <a className="btn btn--fill" href={issue.fullPdfUrl} target="_blank" rel="noopener">
                <span>Download full issue (PDF)</span>
                <IconDownload />
              </a>
            )}
            <Link className="btn btn--line" href="/archive">
              <span>Browse the archive</span>
              <IconArrow />
            </Link>
          </>
        }
      />

      <section className="sec">
        <div className="wrap">
          <div className="spot rv">
            <div className="spot__aside">
              <IssueCover issue={issue} eager />

              <aside className="plate plate--flush" aria-label="Issue record">
                <div className="plate__hd">Issue record</div>
                <dl>
                  {issue.volume != null && (
                    <>
                      <dt>Volume</dt>
                      <dd>{issue.volume}</dd>
                    </>
                  )}
                  {issue.number != null && (
                    <>
                      <dt>Number</dt>
                      <dd>{toRoman(issue.number)}</dd>
                    </>
                  )}
                  <dt>Year</dt>
                  <dd>{issue.year}</dd>
                  <dt>Articles</dt>
                  <dd>{articles.length}</dd>
                  <dt>ISSN</dt>
                  <dd>{ISSN_PRINT}</dd>
                  <dt>E-ISSN</dt>
                  <dd>{ISSN_ONLINE}</dd>
                </dl>
              </aside>
            </div>

            <div className="spot__body">
              <h2 className="blk__h">
                Table of contents
                <span>{articles.length ? `${articles.length} papers` : ""}</span>
              </h2>

              {articles.length === 0 ? (
                <div className="empty">
                  <p className="empty__t">This issue is not yet populated</p>
                  <p className="empty__d">
                    Articles appear here as soon as the editorial office publishes them. The full-issue PDF may
                    already be available above.
                  </p>
                </div>
              ) : (
                <Toc articles={articles} />
              )}
            </div>
          </div>

          {(prev || next) && (
            <nav className="pnav rv" aria-label="Adjacent issues">
              {prev ? (
                <Link href={`/issues/${prev.slug}`}>
                  <span className="pnav__k">← Previous issue</span>
                  <span className="pnav__t">{issueLabel(prev.year, prev.number)}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/issues/${next.slug}`}>
                  <span className="pnav__k">Next issue →</span>
                  <span className="pnav__t">{issueLabel(next.year, next.number)}</span>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>
      </section>
    </main>
  );
}
