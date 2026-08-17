import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { api, type ArticleDetail, type Author, type Issue } from "@/lib/api";
import { articleJsonLd, breadcrumbJsonLd, scholarMeta, JsonLd } from "@/lib/seo";
import { citations } from "@/lib/cite";
import {
  ISSN_ONLINE,
  ISSN_PRINT,
  formatDate,
  issueParts,
  pagesLabel,
  parseKeywords,
} from "@/lib/journal";
import MetricBeacon from "@/components/MetricBeacon";
import PageHeader from "@/components/PageHeader";
import CiteCard from "@/components/CiteCard";
import ShareRow from "@/components/ShareRow";
import Reveal from "@/components/Reveal";
import { IconArrow, IconCheck, IconDownload, MarkMail, MarkOrcid } from "@/components/icons";
import { SITE_URL } from "@/lib/site";
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

/** ORCID records arrive either as a bare identifier or as a full URL. */
function orcidHref(orcid: string): string {
  return orcid.startsWith("http") ? orcid : `https://orcid.org/${orcid}`;
}

function fullName(au: Author): string {
  return `${au.firstName ?? ""} ${au.lastName ?? ""}`.trim();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const a = await load(id);
  if (!a) return { title: "Article not found", robots: { index: false, follow: false } };

  const description = metaDescription(a.abstractText);
  const canonical = `/articles/${a.id}`;
  const authors = a.authors.map(fullName).filter(Boolean);
  // The parent issue's cover is the most specific share image a paper has; the
  // fetch is the same cached call the page body makes, so it costs nothing.
  const issue = await loadIssue(a.issueId);
  const image = issue?.coverUrl ?? undefined;

  return {
    title: a.title,
    description,
    alternates: { canonical },
    keywords: a.keywords ? a.keywords.split(/[;,]/).map((k) => k.trim()).filter(Boolean) : undefined,
    openGraph: {
      type: "article",
      title: a.title,
      description,
      url: canonical,
      siteName: "Machine Science",
      ...(a.publishedAt ? { publishedTime: a.publishedAt } : {}),
      ...(a.subjectArea ? { section: a.subjectArea } : {}),
      ...(authors.length ? { authors } : {}),
      ...(image ? { images: [{ url: image, alt: `Cover of ${issue?.title ?? "the issue"}` }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: a.title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await load(id);
  if (!a) notFound();

  const issue = await loadIssue(a.issueId);
  const pdfUrl = `/api/v1/articles/${a.id}/pdf`;
  const canonical = `${SITE_URL}/articles/${a.id}`;

  // Google Scholar / Crossref highwire citation tags — React 19 hoists <meta> to <head>.
  const citationTags = scholarMeta(a, issue, pdfUrl);
  const cite = citations(a, issue, canonical);

  const keywords = parseKeywords(a.keywords, 12);
  const pages = pagesLabel(a);
  const authorsWithDetail = a.authors.filter((au) => au.affiliation || au.email || au.orcid);

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

      <main>
        <MetricBeacon articleId={a.id} type="FULLTEXT_VIEW" />
        <Reveal />
        <noscript>
          <style>{`.rv{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>

        <PageHeader
          crumbs={[
            { name: "Home", href: "/" },
            { name: "Archive", href: "/archive" },
            ...(issue ? [{ name: issue.title, href: `/issues/${issue.slug}` }] : []),
            { name: a.title },
          ]}
          eyebrow={a.subjectArea || "Research article"}
          title={a.title}
          plain
          lede={
            a.authors.length > 0 ? (
              <span className="art-credit">
                {a.authors.map((au, i) => (
                  <span key={i}>
                    {fullName(au)}
                    {au.corresponding && (
                      <span className="corr" title="Corresponding author">
                        corr
                      </span>
                    )}
                    {i < a.authors.length - 1 ? " · " : ""}
                  </span>
                ))}
              </span>
            ) : undefined
          }
          meta={
            <>
              {issue && (
                <span>
                  <Link href={`/issues/${issue.slug}`}>{issueParts(issue) || issue.title}</Link>
                </span>
              )}
              {pages && <span>{pages}</span>}
              {a.publishedAt && <span>Published {formatDate(a.publishedAt)}</span>}
              {a.doi && (
                <a href={`https://doi.org/${a.doi}`} target="_blank" rel="noopener">
                  doi.org/{a.doi}
                </a>
              )}
            </>
          }
          actions={
            <>
              <a className="btn btn--fill" href={pdfUrl}>
                <span>Download PDF</span>
                <IconDownload />
              </a>
              {issue && (
                <Link className="btn btn--line" href={`/issues/${issue.slug}`}>
                  <span>This issue</span>
                  <IconArrow />
                </Link>
              )}
            </>
          }
        />

        <section className="sec">
          <div className="wrap apg__grid">
            {/* ---------------- paper ---------------- */}
            <div className="apg__main">
              <div className="art-flags rv">
                <span className="art-flag">
                  <IconCheck /> Peer reviewed
                </span>
                <span className="art-flag">
                  <IconCheck /> Open access
                </span>
                <span className="art-flag">
                  <IconCheck /> CC BY 4.0
                </span>
              </div>

              {a.abstractText && (
                <div className="blk rv">
                  <h2 className="blk__h">Abstract</h2>
                  <div className="abs">
                    {a.abstractText
                      .split(/\r?\n\s*\r?\n/)
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                  </div>
                </div>
              )}

              {keywords.length > 0 && (
                <div className="blk rv">
                  <h2 className="blk__h">Keywords</h2>
                  <div className="art-kw">
                    {keywords.map((k) => (
                      <Link className="key" href={`/search?q=${encodeURIComponent(k)}`} key={k}>
                        {k}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {authorsWithDetail.length > 0 && (
                <div className="blk rv">
                  <h2 className="blk__h">Authors &amp; affiliations</h2>
                  <div className="auths">
                    {a.authors.map((au, i) => (
                      <div className="auth-row" key={i}>
                        <span className="auth-row__i" aria-hidden="true">
                          {i + 1}
                        </span>
                        <div>
                          <div className="auth-row__n">
                            {fullName(au)}
                            {au.corresponding && (
                              <span className="corr" title="Corresponding author">
                                corr
                              </span>
                            )}
                          </div>
                          {(au.affiliation || au.country) && (
                            <p className="auth-row__aff">
                              {[au.affiliation, au.country].filter(Boolean).join(", ")}
                            </p>
                          )}
                          {(au.orcid || au.email) && (
                            <div className="auth-row__l links">
                              {au.orcid && (
                                <a
                                  className="lnk lnk--orcid"
                                  href={orcidHref(au.orcid)}
                                  target="_blank"
                                  rel="noopener"
                                  aria-label={`ORCID — ${fullName(au)}`}
                                  title={`ORCID — ${fullName(au)}`}
                                >
                                  <MarkOrcid />
                                </a>
                              )}
                              {au.email && (
                                <a
                                  className="lnk lnk--mail"
                                  href={`mailto:${au.email}`}
                                  aria-label={`E-mail — ${fullName(au)}`}
                                  title={au.email}
                                >
                                  <MarkMail />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="art-note rv">
                This is an open-access article distributed under the terms of the{" "}
                <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener license">
                  Creative Commons Attribution 4.0 licence
                </a>
                , which permits unrestricted use, distribution and reproduction in any medium, provided the original
                work is properly cited.
              </p>
            </div>

            {/* ---------------- action rail ---------------- */}
            <aside className="apg__side">
              <div className="scard">
                <div className="scard__h">Full text</div>
                <a className="btn btn--fill" href={pdfUrl}>
                  <span>Download PDF</span>
                  <IconDownload />
                </a>
                {issue?.fullPdfUrl && (
                  <p style={{ margin: ".8rem 0 0" }}>
                    <a className="btn btn--line" href={issue.fullPdfUrl} target="_blank" rel="noopener">
                      <span>Full issue PDF</span>
                    </a>
                  </p>
                )}
              </div>

              <div className="scard">
                <div className="scard__h">Article metrics</div>
                <div className="mrow">
                  <div>
                    <div className="mrow__v">{a.metrics.views.toLocaleString()}</div>
                    <div className="mrow__k">Views</div>
                  </div>
                  <div>
                    <div className="mrow__v">{a.metrics.downloads.toLocaleString()}</div>
                    <div className="mrow__k">Downloads</div>
                  </div>
                  <div>
                    <div className="mrow__v">{a.metrics.citations.toLocaleString()}</div>
                    <div className="mrow__k">Citations</div>
                  </div>
                </div>
              </div>

              <div className="scard">
                <div className="scard__h">Identifiers</div>
                <dl>
                  {a.doi && (
                    <div>
                      <dt>DOI</dt>
                      <dd>
                        <a href={`https://doi.org/${a.doi}`} target="_blank" rel="noopener">
                          {a.doi}
                        </a>
                      </dd>
                    </div>
                  )}
                  {issue && (
                    <div>
                      <dt>Issue</dt>
                      <dd>
                        <Link href={`/issues/${issue.slug}`}>{issueParts(issue) || issue.title}</Link>
                      </dd>
                    </div>
                  )}
                  {pages && (
                    <div>
                      <dt>Pages</dt>
                      <dd>{pages}</dd>
                    </div>
                  )}
                  {a.publishedAt && (
                    <div>
                      <dt>Published</dt>
                      <dd>{formatDate(a.publishedAt)}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Language</dt>
                    <dd>{(a.language || "en").toUpperCase()}</dd>
                  </div>
                  <div>
                    <dt>ISSN / E-ISSN</dt>
                    <dd>
                      {ISSN_PRINT} · {ISSN_ONLINE}
                    </dd>
                  </div>
                </dl>
              </div>

              <CiteCard formats={cite} />

              <div className="scard">
                <div className="scard__h">Share</div>
                <ShareRow url={canonical} title={a.title} />
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
