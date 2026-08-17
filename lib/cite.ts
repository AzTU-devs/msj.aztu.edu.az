// Citation export — the three formats a reader actually needs from an article
// page: a plain reference to paste into prose, BibTeX for LaTeX, and RIS for
// EndNote / Mendeley / Zotero. Built server-side from the same record the
// citation_* meta tags use, so an exported entry and Google Scholar's index
// never disagree.

import type { ArticleDetail, Issue } from "@/lib/api";
import { ISSN_ONLINE, JOURNAL_NAME, PUBLISHER, toRoman } from "@/lib/journal";

export interface CiteFormats {
  plain: string;
  bibtex: string;
  ris: string;
}

function surnameFirst(a: ArticleDetail): string[] {
  return a.authors.map((au) => {
    const last = (au.lastName || "").trim();
    const first = (au.firstName || "").trim();
    if (last && first) return `${last}, ${first}`;
    return last || first;
  });
}

function fullNames(a: ArticleDetail): string[] {
  return a.authors.map((au) => `${au.firstName ?? ""} ${au.lastName ?? ""}`.trim()).filter(Boolean);
}

function year(a: ArticleDetail, issue: Issue | null): string {
  if (a.publishedAt) {
    const y = new Date(a.publishedAt).getFullYear();
    if (!Number.isNaN(y)) return String(y);
  }
  return issue?.year ? String(issue.year) : "";
}

function pages(a: ArticleDetail): string {
  if (a.pageStart == null) return "";
  return a.pageEnd != null && a.pageEnd !== a.pageStart ? `${a.pageStart}-${a.pageEnd}` : `${a.pageStart}`;
}

/**
 * A BibTeX key of the form `alizade2024topology`. NFD decomposes accented
 * letters into base + combining mark, and the ASCII filter then drops the
 * marks — so "Əlizadə" keys as "lizad" rather than breaking the .bib file.
 */
function bibKey(a: ArticleDetail, yr: string): string {
  const surname = (a.authors[0]?.lastName || JOURNAL_NAME)
    .normalize("NFD")
    .replace(/[^A-Za-z]/g, "")
    .toLowerCase();
  const word = (a.title.match(/[A-Za-z]{4,}/) ?? ["article"])[0].toLowerCase();
  return `${surname || "msj"}${yr}${word}`;
}

export function citations(a: ArticleDetail, issue: Issue | null, url: string): CiteFormats {
  const yr = year(a, issue);
  const pg = pages(a);
  const vol = issue?.volume != null ? String(issue.volume) : "";
  const num = issue?.number != null ? toRoman(issue.number) : "";
  const doi = a.doi ? `https://doi.org/${a.doi}` : "";

  // ---- plain reference -------------------------------------------------
  const plain = [
    surnameFirst(a).join("; "),
    yr ? `(${yr}).` : "",
    `${a.title.replace(/\.\s*$/, "")}.`,
    `${JOURNAL_NAME},`,
    [vol && `Vol. ${vol}`, num && `No. ${num}`].filter(Boolean).join(", "),
    pg ? `pp. ${pg.replace("-", "–")}.` : "",
    doi,
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();

  // ---- BibTeX ----------------------------------------------------------
  const bibFields: [string, string][] = [
    ["author", surnameFirst(a).join(" and ")],
    ["title", a.title],
    ["journal", JOURNAL_NAME],
    ["year", yr],
    ["volume", vol],
    ["number", num],
    ["pages", pg.replace("-", "--")],
    ["issn", ISSN_ONLINE],
    ["publisher", PUBLISHER],
    ["doi", a.doi ?? ""],
    ["url", url],
  ];
  const bibtex =
    `@article{${bibKey(a, yr || "nd")},\n` +
    bibFields
      .filter(([, v]) => v)
      .map(([k, v]) => `  ${k} = {${v}}`)
      .join(",\n") +
    "\n}";

  // ---- RIS -------------------------------------------------------------
  const risLines: string[] = ["TY  - JOUR"];
  for (const name of surnameFirst(a)) risLines.push(`AU  - ${name}`);
  risLines.push(`TI  - ${a.title}`);
  risLines.push(`JO  - ${JOURNAL_NAME}`);
  if (yr) risLines.push(`PY  - ${yr}`);
  if (vol) risLines.push(`VL  - ${vol}`);
  if (num) risLines.push(`IS  - ${num}`);
  if (a.pageStart != null) risLines.push(`SP  - ${a.pageStart}`);
  if (a.pageEnd != null) risLines.push(`EP  - ${a.pageEnd}`);
  risLines.push(`SN  - ${ISSN_ONLINE}`);
  risLines.push(`PB  - ${PUBLISHER}`);
  if (a.doi) risLines.push(`DO  - ${a.doi}`);
  if (a.abstractText) risLines.push(`AB  - ${a.abstractText.replace(/\s+/g, " ").trim()}`);
  for (const k of (a.keywords ?? "").split(/[;,]/).map((s) => s.trim()).filter(Boolean)) {
    risLines.push(`KW  - ${k}`);
  }
  risLines.push(`UR  - ${url}`);
  risLines.push("ER  - ");

  return { plain, bibtex, ris: risLines.join("\n") };
}

/** "Rasim Alizade; Özgün Kilit" — the credit line under an article title. */
export function creditLine(a: ArticleDetail): string {
  return fullNames(a).join("; ");
}
