import type { Metadata } from "next";
import Link from "next/link";
import { api, type Issue } from "@/lib/api";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "Every issue of Machine Science, freely available as full-text PDF. No subscription, no author fee.",
  alternates: { canonical: "/archive" },
  openGraph: {
    title: "Archive",
    description:
      "Every issue of Machine Science, freely available as full-text PDF. No subscription, no author fee.",
    url: "/archive",
    type: "website",
  },
};

// Issue "number" -> Roman numeral. 1..4 are the common journal numbers; a
// general converter covers anything larger, falling back to the raw value.
const ROMAN: Record<number, string> = { 1: "I", 2: "II", 3: "III", 4: "IV" };

function toRoman(n: number | null | undefined): string {
  if (n == null) return "";
  if (ROMAN[n]) return ROMAN[n];
  const rem = Math.floor(n);
  if (rem <= 0) return String(n);
  const table: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  let left = rem;
  for (const [val, sym] of table) {
    while (left >= val) {
      out += sym;
      left -= val;
    }
  }
  return out;
}

function issueLabel(iss: Issue): string {
  const roman = toRoman(iss.number);
  return roman
    ? `Machine Science ${iss.year} — Number ${roman}`
    : `Machine Science ${iss.year}`;
}

async function loadIssues(): Promise<Issue[]> {
  try {
    return await api.issues();
  } catch {
    return [];
  }
}

export default async function ArchivePage() {
  const issues = await loadIssues();

  // Group by year (newest year first); within a year, ascending number (I before II).
  const byYear = new Map<number, Issue[]>();
  for (const iss of issues) {
    const y = iss.year ?? 0;
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(iss);
  }
  const years = Array.from(byYear.keys()).sort((a, b) => b - a);
  for (const y of years) {
    byYear.get(y)!.sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
  }

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Archive", url: "/archive" },
        ])}
      />
      <Reveal />
      {/* No-JS / crawler fallback: .rv is opacity:0 until revealed by JS. */}
      <noscript>
        <style>{`.rv{opacity:1 !important;transform:none !important;}`}</style>
      </noscript>

      <section className="sec" id="archive">
        <div className="wrap">
          <div className="sec__head rv">
            <p className="annot">Archive</p>
            <h2 className="sec__title">Every issue, open</h2>
            <p className="sec__lede">
              All issues are freely available as full-text PDF. No subscription, no author fee.
            </p>
          </div>

          {years.length === 0 ? (
            <p className="sec__lede rv">No issues have been published yet.</p>
          ) : (
            <div className="rv">
              {years.map((year) => (
                <div className="arch-yr" key={year}>
                  <div className="arch-yr__h">{year || "—"}</div>
                  <div className="arch-yr__secs">
                    {byYear.get(year)!.map((iss) => (
                      <Link className="iss" href={`/issues/${iss.slug}`} key={iss.id}>
                        <span className="iss__no">{issueLabel(iss)}</span>
                        <span className="iss__meta">Full-text PDF</span>
                        <svg
                          className="iss__go"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 12h15M13 6l6 6-6 6" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
