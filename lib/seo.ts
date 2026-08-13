// SEO helpers: structured data (schema.org JSON-LD) + Google Scholar / Crossref
// "highwire" citation_* meta tags. These are the reason the site is SSR — they
// must be present in the initial HTML for crawlers and indexers.
//
// JsonLd is defined with React.createElement (no JSX) so this stays a plain
// .ts module while still exporting a renderable component.

import { createElement } from "react";
import type { ArticleDetail, ArticleSummary, Issue } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://msj.aztu.edu.az";

const JOURNAL_NAME = "Machine Science";
const ISSN = ["2227-6912", "2790-0479"] as const; // [print, online]
const PUBLISHER = "Azerbaijan Technical University";
const PUBLISHER_URL = "https://aztu.edu.az";

type AnyArticle = ArticleDetail | ArticleSummary;

function hasAuthors(a: AnyArticle): a is ArticleDetail {
  return "authors" in a && Array.isArray((a as ArticleDetail).authors);
}

/** Author full names, in "Firstname Lastname" order. */
function authorFullNames(a: AnyArticle): string[] {
  if (hasAuthors(a)) return a.authors.map((au) => `${au.firstName} ${au.lastName}`.trim());
  if ("authorNames" in a && a.authorNames) return a.authorNames;
  return [];
}

/** Author names in the "Lastname, Firstname" form Scholar expects. */
function authorCitationNames(a: AnyArticle): string[] {
  if (hasAuthors(a)) return a.authors.map((au) => `${au.lastName}, ${au.firstName}`.trim().replace(/^,\s*/, ""));
  return authorFullNames(a);
}

function absolute(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

// ---------------------------------------------------------------------------
// JSON-LD builders
// ---------------------------------------------------------------------------

/** schema.org Periodical describing the journal itself. Use on the homepage. */
export function journalJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Periodical",
    name: JOURNAL_NAME,
    issn: [...ISSN],
    inLanguage: "en",
    url: SITE_URL,
    publisher: {
      "@type": "Organization",
      name: PUBLISHER,
      url: PUBLISHER_URL,
    },
  };
}

/** schema.org ScholarlyArticle for a single article (optionally within an issue). */
export function articleJsonLd(a: AnyArticle, issue?: Issue | null) {
  const authors = hasAuthors(a)
    ? a.authors.map((au) => ({
        "@type": "Person",
        name: `${au.firstName} ${au.lastName}`.trim(),
        givenName: au.firstName,
        familyName: au.lastName,
        ...(au.affiliation ? { affiliation: { "@type": "Organization", name: au.affiliation } } : {}),
        ...(au.orcid ? { identifier: au.orcid } : {}),
      }))
    : authorFullNames(a).map((name) => ({ "@type": "Person", name }));

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: a.title,
    name: a.title,
    inLanguage: hasAuthors(a) ? a.language || "en" : "en",
    author: authors,
    url: absolute(`/articles/${a.id}`),
    isPartOf: {
      "@type": "PublicationIssue",
      ...(issue?.number != null ? { issueNumber: issue.number } : {}),
      ...(issue?.volume != null ? { volumeNumber: issue.volume } : {}),
      ...(issue?.publishedAt ? { datePublished: issue.publishedAt } : {}),
      isPartOf: {
        "@type": "Periodical",
        name: JOURNAL_NAME,
        issn: [...ISSN],
        publisher: { "@type": "Organization", name: PUBLISHER, url: PUBLISHER_URL },
      },
    },
  };

  if (a.publishedAt) data.datePublished = a.publishedAt;
  if (a.keywords) data.keywords = a.keywords;
  if (hasAuthors(a) && a.abstractText) data.abstract = a.abstractText;
  if (a.doi) {
    data.sameAs = `https://doi.org/${a.doi}`;
    data.identifier = { "@type": "PropertyValue", propertyID: "DOI", value: a.doi };
  }
  if (a.pageStart != null) data.pageStart = a.pageStart;
  if (a.pageEnd != null) data.pageEnd = a.pageEnd;
  return data;
}

/** schema.org BreadcrumbList. Items may use relative urls (resolved to SITE_URL). */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absolute(it.url),
    })),
  };
}

// ---------------------------------------------------------------------------
// Google Scholar / Crossref citation_* meta tags
// ---------------------------------------------------------------------------

export interface MetaTag {
  name: string;
  content: string;
}

/**
 * Google Scholar "highwire" citation tags for an article. Render each as
 * <meta name={t.name} content={t.content} /> — React 19 hoists them to <head>.
 * citation_author repeats once per author.
 */
export function scholarMeta(a: AnyArticle, issue?: Issue | null, pdfUrl?: string): MetaTag[] {
  const tags: MetaTag[] = [];
  const push = (name: string, content: string | number | null | undefined) => {
    if (content != null && content !== "") tags.push({ name, content: String(content) });
  };

  push("citation_title", a.title);
  authorCitationNames(a).forEach((name) => push("citation_author", name));
  if (a.publishedAt) push("citation_publication_date", a.publishedAt.replaceAll("-", "/"));
  push("citation_journal_title", JOURNAL_NAME);
  push("citation_issn", ISSN[1]); // online ISSN
  push("citation_publisher", PUBLISHER);
  if (issue?.volume != null) push("citation_volume", issue.volume);
  if (issue?.number != null) push("citation_issue", issue.number);
  push("citation_firstpage", a.pageStart);
  push("citation_lastpage", a.pageEnd);
  if (a.doi) push("citation_doi", a.doi);
  if (pdfUrl) push("citation_pdf_url", absolute(pdfUrl));
  return tags;
}

// ---------------------------------------------------------------------------
// <JsonLd data={...} /> — renders a <script type="application/ld+json"> tag.
// Accepts a single object or an array of objects.
// ---------------------------------------------------------------------------

export function JsonLd({ data }: { data: object | object[] }) {
  return createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  });
}
