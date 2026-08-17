import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { api, text, type Home, type Locale } from "@/lib/api";
import { JsonLd, journalJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { FOUNDED, ISSN_ONLINE, ISSN_PRINT, PUBLISHER } from "@/lib/journal";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import { IconArrow, IconCheck } from "@/components/icons";
import { ADMIN_URL } from "@/lib/site";

// The journal publishes in English; render the English record.
const LOCALE: Locale = "en";
const DESCRIPTION =
  "About Machine Science — an international scientific and technical journal on the theory of mechanisms and machines, published by Azerbaijan Technical University since 2001. Peer-reviewed, open access, and free of charge to authors. ISSN 2227-6912, E-ISSN 2790-0479.";

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "article",
    title: "About · Machine Science",
    description: DESCRIPTION,
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About · Machine Science",
    description: DESCRIPTION,
  },
};

// Shown only if the backend feed is unreachable, so the page is never empty
// (and crawlers still get a full description). The <b> mirrors .about__body b.
const FALLBACK_ABOUT = [
  "<b>Machine Science</b> is an international scientific and technical journal on the theory of mechanisms and machines, published by Azerbaijan Technical University in Baku. It has appeared continuously since 2001.",
  "The journal is peer-reviewed and fully open access. Every issue is freely available as full-text PDF, and there is no charge to authors at any stage of submission, review, or publication.",
  "Machine Science publishes original research across mechanical engineering technology, the theory of mechanisms and machines, mechatronics, materials, energy and related fields.",
];

async function loadHome(): Promise<Home | null> {
  try {
    return await api.home();
  } catch {
    return null;
  }
}

/** The full description body: texts about.p1..pN, else settings.about, else fallback. */
function aboutParagraphs(home: Home | null): string[] {
  const texts = home?.texts ?? {};
  const paras = Object.keys(texts)
    .filter((k) => /^about\.p\d+$/.test(k))
    .sort((a, b) => Number(a.slice(7)) - Number(b.slice(7)))
    .map((k) => text(texts[k], LOCALE).trim())
    .filter(Boolean);
  if (paras.length) return paras;

  const about = text(home?.settings?.about, LOCALE).trim();
  if (about) {
    return about
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return FALLBACK_ABOUT;
}

/** The "Journal record" plate rows: [label, value] (both may carry inline HTML). */
function journalRecord(home: Home | null): [string, string][] {
  const s = home?.settings;
  const fromFeed = s?.record?.[LOCALE];
  const rows: [string, string][] = fromFeed && fromFeed.length ? [...fromFeed] : [];

  if (!rows.length) {
    if (s?.publisher) rows.push(["Publisher", s.publisher]);
    rows.push(["ISSN (print)", s?.issnPrint || ISSN_PRINT]);
    rows.push(["E-ISSN (online)", s?.issnOnline || ISSN_ONLINE]);
    if (s?.doiPrefix) rows.push(["DOI prefix", s.doiPrefix]);
  }

  // Guarantee the ISSNs appear even if a custom feed record omits them.
  const hasIssn = rows.some(([k, v]) => /issn/i.test(k) || /2227-6912|2790-0479/.test(v));
  if (!hasIssn) {
    rows.push(["ISSN (print)", s?.issnPrint || ISSN_PRINT]);
    rows.push(["E-ISSN (online)", s?.issnOnline || ISSN_ONLINE]);
  }
  return rows;
}

export default async function AboutPage() {
  const home = await loadHome();
  const texts = home?.texts ?? {};
  const settings = home?.settings;

  const label = text(texts["about.label"], LOCALE) || "About the journal";
  const title = text(texts["about.title"], LOCALE) || "A quarter-century of machine science";
  const plateHd = text(texts["plate.hd"], LOCALE) || "Journal record";

  const paras = aboutParagraphs(home);
  const record = journalRecord(home);
  const indexedIn = settings?.indexedIn ?? [];
  const issuesOnline = home?.archive?.length ?? 0;
  const boardSize = home?.board?.length ?? 0;

  return (
    <main>
      <JsonLd
        data={[
          journalJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "About", url: "/about" },
          ]),
        ]}
      />
      <Reveal />

      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "About" }]}
        eyebrow={label}
        title={title}
        lede={`Published by ${settings?.publisher || PUBLISHER} in Baku since ${FOUNDED} — peer-reviewed, fully open access, and free of charge to authors at every stage.`}
        meta={
          <>
            <span>
              ISSN <b>{settings?.issnPrint || ISSN_PRINT}</b>
            </span>
            <span>
              E-ISSN <b>{settings?.issnOnline || ISSN_ONLINE}</b>
            </span>
            {settings?.doiPrefix && (
              <span>
                DOI prefix <b>{settings.doiPrefix}</b>
              </span>
            )}
            <span>
              Licence <b>CC BY 4.0</b>
            </span>
          </>
        }
      />

      <section className="sec" id="about">
        <div className="wrap">
          <div className="about">
            <div className="about__body rv">
              {paras.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}

              <div className="hero__cta" style={{ marginTop: "2rem" }}>
                <a className="btn btn--fill" href={ADMIN_URL}>
                  <span>Submit a manuscript</span>
                  <IconArrow />
                </a>
                <Link className="btn btn--line" href="/scope">
                  <span>Aim &amp; scope</span>
                  <IconArrow />
                </Link>
              </div>
            </div>

            <div className="about__side rv">
              <aside className="plate" aria-label="Journal record">
                <div className="plate__hd">{plateHd}</div>
                <dl>
                  {record.map(([k, v], i) => (
                    <Fragment key={i}>
                      <dt dangerouslySetInnerHTML={{ __html: k }} />
                      <dd dangerouslySetInnerHTML={{ __html: v }} />
                    </Fragment>
                  ))}
                </dl>
              </aside>

              {indexedIn.length > 0 && (
                <aside className="plate" aria-label="Indexing">
                  <div className="plate__hd">Indexed &amp; abstracted in</div>
                  <div className="badges">
                    {indexedIn.map((name, i) => (
                      <span className="badge" key={i}>
                        <IconCheck />
                        {name}
                      </span>
                    ))}
                  </div>
                </aside>
              )}

              <div className="stats">
                <div className="stat">
                  <div className="stat__v">{FOUNDED}</div>
                  <div className="stat__k">Founded</div>
                </div>
                <div className="stat">
                  <div className="stat__v">{issuesOnline || "—"}</div>
                  <div className="stat__k">Issues online</div>
                </div>
                <div className="stat">
                  <div className="stat__v">{boardSize || "—"}</div>
                  <div className="stat__k">Board members</div>
                </div>
                <div className="stat">
                  <div className="stat__v">Free</div>
                  <div className="stat__k">Cost to authors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
