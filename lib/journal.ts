// Journal-record helpers shared by every public page.
//
// Roman numerals, issue labels, date formatting and keyword splitting were
// each re-implemented (slightly differently) in the homepage, the archive and
// the issue page. One copy keeps "Machine Science 2024 — Number II" spelled the
// same everywhere, which is the whole point of a journal of record.

import type { ArticleSummary, Issue } from "@/lib/api";

export const JOURNAL_NAME = "Machine Science";
export const PUBLISHER = "Azerbaijan Technical University";
export const PUBLISHER_URL = "https://aztu.edu.az";
export const ISSN_PRINT = "2227-6912";
export const ISSN_ONLINE = "2790-0479";
export const FOUNDED = 2001;

const ROMAN_TABLE: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

/** Issue "number" -> Roman numeral; anything unconvertible falls back to the raw value. */
export function toRoman(n: number | null | undefined): string {
  if (n == null) return "";
  const whole = Math.floor(n);
  if (!Number.isFinite(whole) || whole <= 0) return String(n);
  let out = "";
  let left = whole;
  for (const [val, sym] of ROMAN_TABLE) {
    while (left >= val) {
      out += sym;
      left -= val;
    }
  }
  return out;
}

/** "Machine Science 2024 — Number II" (the form the journal prints). */
export function issueLabel(year: number | null | undefined, number: number | null | undefined): string {
  const r = toRoman(number);
  const y = year ?? "";
  return r ? `${JOURNAL_NAME} ${y} — Number ${r}` : `${JOURNAL_NAME} ${y}`.trim();
}

/** "Volume 12 · Number II · 2024" — only the parts the record actually has. */
export function issueParts(issue: Pick<Issue, "volume" | "number" | "year">): string {
  return [
    issue.volume != null ? `Volume ${issue.volume}` : null,
    issue.number != null ? `Number ${toRoman(issue.number)}` : null,
    issue.year ? String(issue.year) : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

/** "12 March 2024" — long-form British dates, matching the journal's copy. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** Keywords arrive as one comma/semicolon-separated string. */
export function parseKeywords(raw: string | null | undefined, limit = 4): string[] {
  if (!raw) return [];
  return String(raw)
    .split(/[;,]/)
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, limit);
}

/** "pp. 14–29" / "p. 14" / null when the record carries no pagination. */
export function pagesLabel(a: Pick<ArticleSummary, "pageStart" | "pageEnd">): string | null {
  if (a.pageStart == null) return null;
  return a.pageEnd != null && a.pageEnd !== a.pageStart
    ? `pp. ${a.pageStart}–${a.pageEnd}`
    : `p. ${a.pageStart}`;
}

/** Group issues newest-year-first; within a year, Number I before Number II. */
export function groupIssuesByYear(issues: Issue[]): { year: number; issues: Issue[] }[] {
  const byYear = new Map<number, Issue[]>();
  for (const iss of issues) {
    const y = iss.year ?? 0;
    const bucket = byYear.get(y);
    if (bucket) bucket.push(iss);
    else byYear.set(y, [iss]);
  }
  return Array.from(byYear.keys())
    .sort((a, b) => b - a)
    .map((year) => ({
      year,
      issues: byYear.get(year)!.slice().sort((a, b) => (a.number ?? 0) - (b.number ?? 0)),
    }));
}

/** Authors as a display string, eliding a long list the way a TOC does. */
export function authorLine(names: string[] | null | undefined, max = 6): string {
  if (!names || names.length === 0) return "";
  if (names.length <= max) return names.join(", ");
  return `${names.slice(0, max).join(", ")} et al.`;
}
