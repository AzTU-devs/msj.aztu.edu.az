import type { Metadata } from "next";
import { api, BoardMember } from "@/lib/api";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import Reveal from "@/components/Reveal";

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

// ORCID / Scopus / e-mail marks — the same simplified glyphs the approved
// design ships (styled by .lnk in design.css; fill:currentColor).
const OrcidMark = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 1.6A10.4 10.4 0 1022.4 12 10.4 10.4 0 0012 1.6zm0 1.7A8.7 8.7 0 113.3 12 8.7 8.7 0 0112 3.3z" />
    <rect x="6.4" y="9.1" width="1.7" height="8" />
    <circle cx="7.25" cy="7.1" r="1.1" />
    <path d="M10.3 9.1h3.5c3 0 4.4 2 4.4 4s-1.6 4-4.4 4h-3.5zm1.7 1.6v4.9h1.7c2 0 2.8-1.1 2.8-2.4s-.9-2.4-2.8-2.4z" />
  </svg>
);

const ScopusMark = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M16.9 6.6a7.7 7.7 0 00-4.2-1.3c-2.6 0-4.4 1.5-4.4 3.6 0 1.9 1.3 3 3.7 3.8l1.4.5c1.7.6 2.4 1.2 2.4 2.2 0 1.2-1.1 2-2.8 2a6.6 6.6 0 01-3.9-1.4l-.9 1.5a8.2 8.2 0 004.8 1.6c2.9 0 4.9-1.6 4.9-3.9 0-2-1.2-3.1-3.8-4l-1.4-.5c-1.6-.5-2.3-1.1-2.3-2.1 0-1.1 1-1.8 2.5-1.8a6 6 0 013.2 1z" />
  </svg>
);

const MailMark = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3.5 5h17A1.5 1.5 0 0122 6.5v11a1.5 1.5 0 01-1.5 1.5H19V9.4l-7 5-7-5V19H3.5A1.5 1.5 0 012 17.5v-11A1.5 1.5 0 013.5 5zm.9 1.8L12 12.2l7.6-5.4z" />
  </svg>
);

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
        {OrcidMark}
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
        {ScopusMark}
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
        {MailMark}
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
        {m.photoUrl ? <img src={m.photoUrl} alt={m.fullName} /> : null}
      </div>
      <div>
        <div className="ed__role">{ROLE_LABEL[m.section]}</div>
        <div className="ed__n">{m.fullName}</div>
        {m.title ? <p className="ed__t">{m.title}</p> : null}
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

  return (
    <main>
      {/* Without JS the .rv elements stay at opacity:0 — reveal them so the page
          is never blank for no-JS clients and crawlers. */}
      <noscript>
        <style>{`.rv{opacity:1 !important;transform:none !important;}`}</style>
      </noscript>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Editorial Board", url: "/board" },
        ])}
      />

      <section className="sec" id="board">
        <div className="wrap">
          <div className="sec__head rv">
            <p className="annot">Editorial board</p>
            <h1 className="sec__title">Who reviews the work</h1>
          </div>

          {leads.length > 0 && (
            <div className="board rv">
              {leads.map((m) => (
                <LeadCard key={m.id} m={m} />
              ))}
            </div>
          )}

          {members.length > 0 && (
            <div className="members rv">
              <div className="members__hd">Editors &amp; peer reviewers</div>
              <div className="members__grid">
                {members.map((m) => (
                  <figure className="mem" key={m.id}>
                    <div className="mem__ph">
                      {m.photoUrl ? (
                        <img
                          src={m.photoUrl}
                          alt={m.fullName}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : null}
                    </div>
                    <figcaption>
                      <div className="mem__n">{m.fullName}</div>
                      {m.title ? <p className="mem__t">{m.title}</p> : null}
                    </figcaption>
                    <ProfileLinks m={m} />
                  </figure>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Reveal />
    </main>
  );
}
