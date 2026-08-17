import type { Metadata } from "next";
import { api, BoardMember } from "@/lib/api";
import { JsonLd, breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import { MarkMail, MarkOrcid, MarkScopus } from "@/components/icons";

export const metadata: Metadata = {
  title: "Editorial Board",
  description:
    "The editors and peer reviewers of Machine Science — Editor-in-Chief, Honorary Editor and the international editorial board reviewing the journal's work.",
  alternates: { canonical: "/board" },
  openGraph: {
    type: "website",
    title: "Editorial Board · Machine Science",
    description:
      "Editor-in-Chief, Honorary Editor and the international editorial board of Machine Science.",
    url: "/board",
  },
};

// Board can be fetched fresh via ISR without breaking the build if the API is
// down — mirror the article page / sitemap pattern and degrade to an empty list.
async function load(): Promise<BoardMember[]> {
  try {
    return await api.board();
  } catch {
    return [];
  }
}

// The three sections the feed distinguishes. Lead cards (.ed) label their role;
// everyone under BOARD is a plate portrait (.mem) in the members grid.
const ROLE_LABEL: Record<BoardMember["section"], string> = {
  EDITOR_IN_CHIEF: "Editor-in-Chief",
  HONORARY: "Honorary Editor",
  BOARD: "Editor",
};

/** Profile links for one member — only the marks that person actually has. */
function ProfileLinks({ m }: { m: BoardMember }) {
  const links: React.ReactNode[] = [];
  if (m.orcidUrl)
    links.push(
      <a
        key="orcid"
        className="lnk lnk--orcid"
        href={m.orcidUrl}
        target="_blank"
        rel="noopener"
        aria-label={`ORCID — ${m.fullName}`}
        title={`ORCID — ${m.fullName}`}
      >
        <MarkOrcid />
      </a>
    );
  if (m.scopusUrl)
    links.push(
      <a
        key="scopus"
        className="lnk lnk--scopus"
        href={m.scopusUrl}
        target="_blank"
        rel="noopener"
        aria-label={`Scopus — ${m.fullName}`}
        title={`Scopus — ${m.fullName}`}
      >
        <MarkScopus />
      </a>
    );
  if (m.email)
    links.push(
      <a
        key="mail"
        className="lnk lnk--mail"
        href={`mailto:${m.email}`}
        aria-label={`E-mail — ${m.fullName}`}
        title={`E-mail — ${m.fullName}`}
      >
        <MarkMail />
      </a>
    );

  if (!links.length) return null;
  return <div className="links">{links}</div>;
}

/** A lead editor (Editor-in-Chief / Honorary) rendered as an .ed card. */
function LeadCard({ m }: { m: BoardMember }) {
  return (
    <div className="ed">
      <div className="ed__av">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {m.photoUrl ? <img src={m.photoUrl} alt={m.fullName} /> : null}
      </div>
      <div>
        <div className="ed__role">{ROLE_LABEL[m.section]}</div>
        <div className="ed__n">{m.fullName}</div>
        {m.title ? <p className="ed__t">{m.title}</p> : null}
        {m.country ? <p className="ed__ct">{m.country}</p> : null}
        <ProfileLinks m={m} />
      </div>
    </div>
  );
}

export default async function BoardPage() {
  const board = await load();

  // Lead cards first (Editor-in-Chief, then Honorary), then the members grid.
  const leads = [
    ...board.filter((m) => m.section === "EDITOR_IN_CHIEF"),
    ...board.filter((m) => m.section === "HONORARY"),
  ];
  const members = board.filter((m) => m.section === "BOARD");

  // Countries the board covers — the single most telling fact about the reach
  // of an international editorial board, and free from the record we already have.
  const countries = Array.from(
    new Set(board.map((m) => (m.country ?? "").trim()).filter(Boolean))
  ).sort();

  return (
    <main>
      {/* Without JS the .rv elements stay at opacity:0 — reveal them so the page
          is never blank for no-JS clients and crawlers. */}
      <noscript>
        <style>{`.rv{opacity:1 !important;transform:none !important;}`}</style>
      </noscript>

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Editorial Board", url: "/board" },
          ]),
          collectionJsonLd({
            name: "Machine Science — Editorial Board",
            url: "/board",
            description:
              "Editor-in-Chief, Honorary Editor and the international editorial board of Machine Science.",
          }),
          // Naming the board as people, with their affiliations, is what makes a
          // journal legible to indexing services assessing editorial standards.
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Editorial board of Machine Science",
            numberOfItems: board.length,
            itemListElement: board.map((m, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Person",
                name: m.fullName,
                ...(m.title ? { jobTitle: ROLE_LABEL[m.section], affiliation: { "@type": "Organization", name: m.title } } : {}),
                ...(m.orcidUrl ? { sameAs: m.orcidUrl } : {}),
                ...(m.country ? { nationality: m.country } : {}),
              },
            })),
          },
        ]}
      />

      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Editorial Board" }]}
        eyebrow="Editorial board"
        title="Who reviews the work"
        lede="Every manuscript is assessed by subject specialists from the journal's international board before it is accepted for publication."
        meta={
          board.length > 0 ? (
            <>
              <span>
                <b>{board.length}</b> editors &amp; reviewers
              </span>
              {countries.length > 0 && (
                <span>
                  <b>{countries.length}</b> countries
                </span>
              )}
              <span>Double-blind peer review</span>
            </>
          ) : undefined
        }
      />

      <section className="sec" id="board">
        <div className="wrap">
          {board.length === 0 ? (
            <div className="empty rv">
              <p className="empty__t">The board list is temporarily unavailable</p>
              <p className="empty__d">
                The editorial board is served from the journal&apos;s record system. Please try again shortly, or write
                to the editorial office.
              </p>
            </div>
          ) : (
            <>
              {leads.length > 0 && (
                <div className="board rv">
                  {leads.map((m) => (
                    <LeadCard key={m.id} m={m} />
                  ))}
                </div>
              )}

              {members.length > 0 && (
                <div className="members rv">
                  <div className="members__hd">
                    Editors &amp; peer reviewers — {members.length} in total
                  </div>
                  <div className="members__grid">
                    {members.map((m) => (
                      <figure className="mem" key={m.id}>
                        <div className="mem__ph">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {m.photoUrl ? (
                            <img src={m.photoUrl} alt={m.fullName} loading="lazy" decoding="async" />
                          ) : null}
                        </div>
                        <figcaption>
                          {m.country ? <p className="mem__c">{m.country}</p> : null}
                          <div className="mem__n">{m.fullName}</div>
                          {m.title ? <p className="mem__t">{m.title}</p> : null}
                        </figcaption>
                        <ProfileLinks m={m} />
                      </figure>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Reveal />
    </main>
  );
}
