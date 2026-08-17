import type { Metadata } from "next";
import Link from "next/link";
import { api, type Issue } from "@/lib/api";
import { breadcrumbJsonLd, collectionJsonLd, JsonLd } from "@/lib/seo";
import { FOUNDED, groupIssuesByYear, issueLabel, issueParts } from "@/lib/journal";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import IssueCover from "@/components/IssueCover";
import { IconArrow, IconSearch } from "@/components/icons";
import { SITE_URL } from "@/lib/site";

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

async function loadIssues(): Promise<Issue[]> {
  try {
    return await api.issues();
  } catch {
    return [];
  }
}

export default async function ArchivePage() {
  const issues = await loadIssues();
  const years = groupIssuesByYear(issues);
  const span = years.length ? `${years[years.length - 1].year}–${years[0].year}` : `${FOUNDED}–`;

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Archive", url: "/archive" },
          ]),
          collectionJsonLd({
            name: "Machine Science — Archive",
            url: "/archive",
            description:
              "Every issue of Machine Science, freely available as full-text PDF. No subscription, no author fee.",
          }),
          // An explicit list of the issues, so a crawler reading only the
          // structured data still learns the shape of the run.
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Issues of Machine Science",
            numberOfItems: issues.length,
            itemListOrder: "https://schema.org/ItemListOrderDescending",
            itemListElement: issues.slice(0, 100).map((iss, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: issueLabel(iss.year, iss.number),
              url: `${SITE_URL}/issues/${iss.slug}`,
            })),
          },
        ]}
      />
      <Reveal />
      {/* No-JS / crawler fallback: .rv is opacity:0 until revealed by JS. */}
      <noscript>
        <style>{`.rv{opacity:1 !important;transform:none !important;}`}</style>
      </noscript>

      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Archive" }]}
        eyebrow="Archive"
        title="Every issue, open"
        lede="All issues are freely available as full-text PDF. No subscription, no registration and no author fee — the complete run of the journal, from the first number to the current one."
        meta={
          issues.length > 0 ? (
            <>
              <span>
                <b>{issues.length}</b> issues
              </span>
              <span>
                <b>{years.length}</b> years
              </span>
              <span>{span}</span>
            </>
          ) : undefined
        }
        actions={
          <Link className="btn btn--line" href="/search">
            <span>Search articles</span>
            <IconSearch />
          </Link>
        }
      />

      <section className="sec" id="archive">
        <div className="wrap">
          {years.length === 0 ? (
            <div className="empty rv">
              <p className="empty__t">No issues have been published yet</p>
              <p className="empty__d">
                Issues appear here the moment the editorial office publishes them. In the meantime, the call for
                papers is open.
              </p>
            </div>
          ) : (
            years.map(({ year, issues: yearIssues }) => (
              <div className="yrblk rv" key={year}>
                <div className="yrblk__h">
                  <span className="yrblk__y">{year || "—"}</span>
                  <span className="yrblk__n">
                    {yearIssues.length} {yearIssues.length === 1 ? "number" : "numbers"}
                  </span>
                </div>

                <div className="aprev">
                  {yearIssues.map((iss) => (
                    <Link className="acard" href={`/issues/${iss.slug}`} key={iss.id}>
                      <IssueCover issue={iss} />
                      <span className="acard__t">{issueLabel(iss.year, iss.number)}</span>
                      <p className="acard__m">
                        {issueParts(iss) || "Full-text PDF"}
                        <IconArrow />
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
