// SEO helpers: structured data (schema.org JSON-LD), Google Scholar / Crossref
// "highwire" citation_* meta tags, Dublin Core and PRISM. These are the reason
// the site is SSR — they must be present in the initial HTML for crawlers,
// indexers and reference managers.
//
// Who consumes what:
//   · citation_*  — Google Scholar, Crossref, Zotero/Mendeley connectors
//   · dc.*        — OAI-PMH harvesters, library discovery layers
//   · prism.*     — Scopus / abstracting services
//   · JSON-LD     — Google Search (rich results, sitelinks search box)
//
// JsonLd is defined with React.createElement (no JSX) so this stays a plain
// .ts module while still exporting a renderable component.

import { createElement } from "react";
import type { ArticleDetail, ArticleSummary, Issue } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

const JOURNAL_NAME = "Machine Science";
const ISSN = ["2227-6912", "2790-0479"] as const; // [print, online]
const PUBLISHER = "Azerbaijan Technical University";
const PUBLISHER_URL = "https://aztu.edu.az";
const FOUNDED = "2001";
const LICENSE = "https://creativecommons.org/licenses/by/4.0/";

const JOURNAL_DESCRIPTION =
  "International scientific and technical journal on the theory of mechanisms and machines, published by Azerbaijan Technical University since 2001. Peer-reviewed, open access, free of charge to authors.";

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

/** The publication year, from the article date, else the issue's. */
function pubYear(a: AnyArticle, issue?: Issue | null): string | undefined {
  if (a.publishedAt) {
    const y = new Date(a.publishedAt).getFullYear();
    if (!Number.isNaN(y)) return String(y);
  }
  return issue?.year ? String(issue.year) : undefined;
}

// ---------------------------------------------------------------------------
// JSON-LD builders
// ---------------------------------------------------------------------------

/** The publisher of record. Referenced by every other node. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#publisher`,
    name: PUBLISHER,
    url: PUBLISHER_URL,
    address: {
      "@type": "PostalAddress",
      streetAddress: "H. Javid ave 25",
      addressLocality: "Baku",
      postalCode: "AZ 1073",
      addressCountry: "AZ",
    },
  };
}

/**
 * WebSite node carrying the sitelinks SearchAction. This is what lets Google
 * render a search box under the site's result and route the query straight at
 * /search — the single highest-leverage bit of structured data a site with an
 * internal search can publish.
 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: JOURNAL_NAME,
    alternateName: "Machine Science Journal",
    url: SITE_URL,
    description: JOURNAL_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#publisher` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** schema.org Periodical describing the journal itself. Use on the homepage. */
export function journalJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Periodical",
    "@id": `${SITE_URL}/#periodical`,
    name: JOURNAL_NAME,
    alternateName: "Machine Science Journal",
    description: JOURNAL_DESCRIPTION,
    issn: [...ISSN],
    inLanguage: "en",
    url: SITE_URL,
    foundingDate: FOUNDED,
    isAccessibleForFree: true,
    license: LICENSE,
    publisher: organizationJsonLd(),
    sameAs: [PUBLISHER_URL],
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
        ...(au.orcid
          ? { identifier: au.orcid, sameAs: au.orcid.startsWith("http") ? au.orcid : `https://orcid.org/${au.orcid}` }
          : {}),
      }))
    : authorFullNames(a).map((name) => ({ "@type": "Person", name }));

  const url = absolute(`/articles/${a.id}`);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: a.title,
    name: a.title,
    inLanguage: hasAuthors(a) ? a.language || "en" : "en",
    author: authors,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    // Open-access signals: Google surfaces a free-to-read badge from these, and
    // they are what a discovery service checks before harvesting the record.
    isAccessibleForFree: true,
    license: LICENSE,
    copyrightHolder: { "@id": `${SITE_URL}/#publisher` },
    publisher: organizationJsonLd(),
    ...(a.subjectArea ? { about: a.subjectArea } : {}),
    isPartOf: {
      "@type": "PublicationIssue",
      ...(issue?.number != null ? { issueNumber: issue.number } : {}),
      ...(issue?.title ? { name: issue.title } : {}),
      ...(issue?.slug ? { url: absolute(`/issues/${issue.slug}`) } : {}),
      ...(issue?.publishedAt ? { datePublished: issue.publishedAt } : {}),
      isPartOf:
        issue?.volume != null
          ? {
              "@type": "PublicationVolume",
              volumeNumber: issue.volume,
              isPartOf: { "@id": `${SITE_URL}/#periodical` },
            }
          : { "@id": `${SITE_URL}/#periodical` },
    },
  };

  const year = pubYear(a, issue);
  if (year) data.copyrightYear = year;
  if (a.publishedAt) {
    data.datePublished = a.publishedAt;
    data.dateModified = a.publishedAt;
  }
  if (a.keywords) data.keywords = a.keywords;
  if (hasAuthors(a) && a.abstractText) {
    data.abstract = a.abstractText;
    data.description = a.abstractText.replace(/\s+/g, " ").trim().slice(0, 300);
  }
  if (a.doi) {
    data.sameAs = `https://doi.org/${a.doi}`;
    data.identifier = { "@type": "PropertyValue", propertyID: "DOI", value: a.doi };
  }
  if (a.pageStart != null) data.pageStart = a.pageStart;
  if (a.pageEnd != null) data.pageEnd = a.pageEnd;
  if (issue?.coverUrl) data.image = absolute(issue.coverUrl);
  return data;
}

/** schema.org CollectionPage for a listing route (archive, board, scope). */
export function collectionJsonLd(opts: { name: string; url: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: absolute(opts.url),
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#publisher` },
  };
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
// Google Scholar / Crossref citation_* + Dublin Core + PRISM meta tags
// ---------------------------------------------------------------------------

export interface MetaTag {
  name: string;
  content: string;
}

/**
 * Bibliographic meta tags for an article. Render each as
 * <meta name={t.name} content={t.content} /> — React 19 hoists them to <head>.
 *
 * Ordering matters for Scholar: citation_author_institution must immediately
 * follow the citation_author it belongs to, so the author block is interleaved
 * rather than emitted as two runs.
 */
export function scholarMeta(a: AnyArticle, issue?: Issue | null, pdfUrl?: string): MetaTag[] {
  const tags: MetaTag[] = [];
  const push = (name: string, content: string | number | null | undefined) => {
    if (content != null && content !== "") tags.push({ name, content: String(content) });
  };

  const url = absolute(`/articles/${a.id}`);
  const year = pubYear(a, issue);
  const abstract = hasAuthors(a) && a.abstractText ? a.abstractText.replace(/\s+/g, " ").trim() : "";

  // ---- highwire (Google Scholar, Crossref, reference managers) ----
  push("citation_title", a.title);

  if (hasAuthors(a)) {
    for (const au of a.authors) {
      const name = `${au.lastName}, ${au.firstName}`.trim().replace(/^,\s*/, "");
      if (!name) continue;
      push("citation_author", name);
      push("citation_author_institution", au.affiliation);
      push("citation_author_email", au.email);
      if (au.orcid) push("citation_author_orcid", au.orcid.replace(/^https?:\/\/orcid\.org\//, ""));
    }
  } else {
    authorCitationNames(a).forEach((name) => push("citation_author", name));
  }

  if (a.publishedAt) {
    push("citation_publication_date", a.publishedAt.replaceAll("-", "/"));
    push("citation_online_date", a.publishedAt.replaceAll("-", "/"));
  } else if (year) {
    push("citation_publication_date", year);
  }
  push("citation_journal_title", JOURNAL_NAME);
  push("citation_journal_abbrev", "Mach. Sci.");
  push("citation_issn", ISSN[1]); // online ISSN first — the one Scholar prefers
  push("citation_issn", ISSN[0]);
  push("citation_publisher", PUBLISHER);
  push("citation_language", hasAuthors(a) ? a.language || "en" : "en");
  if (issue?.volume != null) push("citation_volume", issue.volume);
  if (issue?.number != null) push("citation_issue", issue.number);
  push("citation_firstpage", a.pageStart);
  push("citation_lastpage", a.pageEnd);
  if (a.doi) push("citation_doi", a.doi);
  if (a.keywords) push("citation_keywords", a.keywords.split(/[;,]/).map((k) => k.trim()).filter(Boolean).join("; "));
  push("citation_abstract_html_url", url);
  if (pdfUrl) push("citation_pdf_url", absolute(pdfUrl));
  // Tells Scholar the full text is free — required for the [PDF] link to show.
  // Its content is empty by convention, so it bypasses `push`'s blank filter.
  tags.push({ name: "citation_fulltext_world_readable", content: "" });

  // ---- Dublin Core (OAI harvesters, library discovery layers) ----
  push("dc.title", a.title);
  authorCitationNames(a).forEach((name) => push("dc.creator", name));
  push("dc.publisher", PUBLISHER);
  push("dc.date", a.publishedAt || year);
  push("dc.type", "Text.Article");
  push("dc.format", "application/pdf");
  push("dc.language", hasAuthors(a) ? a.language || "en" : "en");
  push("dc.identifier", a.doi ? `doi:${a.doi}` : url);
  push("dc.source", `${JOURNAL_NAME}; ISSN ${ISSN[0]}`);
  push("dc.rights", LICENSE);
  if (abstract) push("dc.description", abstract.slice(0, 500));
  if (a.keywords) push("dc.subject", a.keywords);

  // ---- PRISM (abstracting & indexing services) ----
  push("prism.publicationName", JOURNAL_NAME);
  push("prism.issn", ISSN[0]);
  push("prism.eIssn", ISSN[1]);
  if (issue?.volume != null) push("prism.volume", issue.volume);
  if (issue?.number != null) push("prism.number", issue.number);
  push("prism.startingPage", a.pageStart);
  push("prism.endingPage", a.pageEnd);
  push("prism.publicationDate", a.publishedAt || year);
  if (a.doi) push("prism.doi", a.doi);
  push("prism.url", url);

  return tags;
}

// ---------------------------------------------------------------------------
// <JsonLd data={...} /> — renders a <script type="application/ld+json"> tag.
// Accepts a single object or an array of objects.
// ---------------------------------------------------------------------------

export function JsonLd({ data }: { data: object | object[] }) {
  return createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: {
      // Escape "<" so a stray "</script>" inside a title or abstract cannot
      // close the tag early — the one XSS vector a JSON-LD block has.
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    },
  });
}
