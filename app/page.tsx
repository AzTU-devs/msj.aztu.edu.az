import type { Metadata } from "next";
import Link from "next/link";
import { api, text, type Home } from "@/lib/api";
import { JsonLd, journalJsonLd } from "@/lib/seo";
import HeroSlider, { type HeroSlide } from "@/components/HeroSlider";
import CardMetrics from "@/components/CardMetrics";

// Author sign-in / manuscript submission live in the portal (admin app); the
// public site only links out to it.
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || "http://10.3.43.77:5000";

const DESCRIPTION =
  "Machine Science — international scientific and technical journal on the theory of mechanisms and machines, published by Azerbaijan Technical University since 2001. Peer-reviewed, open access, free of charge to authors. ISSN 2227-6912, E-ISSN 2790-0479.";

export const metadata: Metadata = {
  // `absolute` opts out of the layout's "%s · Machine Science" template so the
  // homepage carries the full journal title on its own.
  title: { absolute: "Machine Science — International Scientific & Technical Journal" },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Machine Science",
    title: "Machine Science — International Scientific & Technical Journal",
    description: DESCRIPTION,
    url: "/",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "Machine Science — International Scientific & Technical Journal",
    description: DESCRIPTION,
  },
};

// The homepage is now static-ish SSR: revalidated by the underlying api.home()
// fetch (300s). If the backend is unreachable we still render a clean shell.
async function loadHome(): Promise<Home | null> {
  try {
    return await api.home();
  } catch {
    return null;
  }
}

const ROMAN: Record<number, string> = { 1: "I", 2: "II", 3: "III", 4: "IV" };
function roman(n: number | null | undefined): string {
  if (n == null) return "";
  return ROMAN[n] ?? String(n);
}

function issueLabel(year: number, number: number | null | undefined): string {
  const r = roman(number);
  return r ? `Machine Science ${year} — Number ${r}` : `Machine Science ${year}`;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function parseKeywords(kw: string | null | undefined): string[] {
  if (!kw) return [];
  return String(kw)
    .split(/[;,]/)
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 3);
}

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export default async function HomePage() {
  const home = await loadHome();
  const tx = home?.texts ?? {};
  const t = (key: string, fallback: string) => text(tx[key], "en") || fallback;

  // --- hero -----------------------------------------------------------------
  const heroSlides: HeroSlide[] = (home?.heroSlides ?? []).map((s) => ({
    imageUrl: s.imageUrl,
    altText: s.altText ?? "",
    caption: text(s.caption, "en"),
  }));
  const heroLede = text(tx["hero.lede"], "en");

  const current = home?.currentIssue ?? null;
  const currentSlug = current?.issue?.slug;
  const readCurrentHref = currentSlug ? `/issues/${currentSlug}` : "/archive";

  // Number of issues available online — used for the hero spec tally.
  const issuesOnline = home?.archive?.length ?? 0;

  // --- about intro ----------------------------------------------------------
  const aboutParas = Object.keys(tx)
    .filter((k) => /^about\.p\d+$/.test(k))
    .sort()
    .map((k) => text(tx[k], "en"))
    .filter(Boolean);
  const aboutFallback = text(home?.settings?.about, "en");
  const aboutBody = (aboutParas.length ? aboutParas : aboutFallback ? [aboutFallback] : []).slice(0, 2);

  // --- current issue --------------------------------------------------------
  const ciArticles = current?.articles ?? [];
  const featured = ciArticles[0];
  const restArticles = ciArticles.slice(1);

  // --- open call for papers -------------------------------------------------
  const openCalls = home?.openCalls ?? [];

  return (
    <main id="top">
      <JsonLd data={journalJsonLd()} />

      {/* ================= HERO / SLIDER ================= */}
      <HeroSlider slides={heroSlides}>
        <div className="wrap hero__in">
          <div className="hero__col">
            <p className="annot hero__eyebrow">{t("hero.eyebrow", "Azerbaijan Technical University · Baku")}</p>

            <h1 className="masthead" lang="en">
              <span className="ln ln--1"><span>Machine</span></span>
              <span className="ln ln--2"><span>Science</span></span>
            </h1>

            {heroLede ? (
              <p className="hero__lede" dangerouslySetInnerHTML={{ __html: heroLede }} />
            ) : (
              <p className="hero__lede">
                An <em>international scientific and technical journal</em> on the theory of mechanisms and machines —
                published continuously since 2001, peer-reviewed, and free of charge to authors.
              </p>
            )}

            <div className="hero__cta">
              <Link className="btn btn--fill" href={readCurrentHref}>
                <span>{t("hero.cta1", "Read current issue")}</span>
                <Arrow />
              </Link>
              <a className="btn btn--line" href={ADMIN_URL}>{t("hero.cta2", "Submit a manuscript")}</a>
            </div>

            <div className="specs">
              <div className="spec">
                <div className="spec__v">2001</div>
                <div className="spec__k">{t("spec.since", "Published since")}</div>
              </div>
              <div className="spec">
                <div className="spec__v">{issuesOnline || 9}</div>
                <div className="spec__k">{t("spec.issues", "Issues online")}</div>
              </div>
              <div className="spec">
                <div className="spec__v">2011</div>
                <div className="spec__k">{t("spec.inspec", "INSPEC indexed")}</div>
              </div>
              <div className="spec">
                <div className="spec__v">{t("spec.free", "Free")}</div>
                <div className="spec__k">{t("spec.cost", "Cost to authors")}</div>
              </div>
            </div>
          </div>
        </div>
      </HeroSlider>

      {/* ================= ABOUT (intro) ================= */}
      {aboutBody.length > 0 && (
        <section className="sec" id="about">
          <div className="wrap">
            <div className="sec__head">
              <p className="annot">{t("about.label", "About the journal")}</p>
              <h2 className="sec__title">{t("about.title", "A quarter-century of machine science")}</h2>
            </div>

            <div className="about__body">
              {aboutBody.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p>
                <Link className="btn btn--line" href="/about">
                  <span>Read more</span>
                  <Arrow />
                </Link>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ================= CURRENT ISSUE ================= */}
      {current && (
        <section className="sec" id="current">
          <div className="wrap">
            <div className="sec__head issue__top">
              <div>
                <p className="annot">{t("current.label", "Current issue")}</p>
                <h2 className="sec__title">{issueLabel(current.issue.year, current.issue.number)}</h2>
              </div>
              <Link className="btn btn--line" href="/archive">
                <span>{t("current.browse", "Browse the archive")}</span>
                <Arrow />
              </Link>
            </div>

            {featured && (
              <Link className="feat" href={`/articles/${featured.id}`}>
                <div className="feat__no">01</div>
                <div>
                  <span className="feat__tag">
                    Featured{featured.subjectArea ? ` · ${featured.subjectArea}` : ""}
                  </span>
                  <h3 className="feat__title">{featured.title}</h3>
                  {featured.authorNames.length > 0 && (
                    <p className="feat__auth">{featured.authorNames.join(", ")}</p>
                  )}
                  {featured.doi && <span className="feat__doi">doi.org/{featured.doi}</span>}
                  <CardMetrics m={featured.metrics} />
                </div>
              </Link>
            )}

            {restArticles.length > 0 && (
              <div className="arts">
                {restArticles.map((a) => (
                  <Link key={a.id} className="art" href={`/articles/${a.id}`}>
                    {a.subjectArea && <div className="art__field">{a.subjectArea}</div>}
                    <h3 className="art__title">{a.title}</h3>
                    {a.authorNames.length > 0 && <p className="art__auth">{a.authorNames.join(", ")}</p>}
                    {parseKeywords(a.keywords).length > 0 && (
                      <div className="art__keys">
                        {parseKeywords(a.keywords).map((k) => (
                          <span key={k} className="key">{k}</span>
                        ))}
                      </div>
                    )}
                    <CardMetrics m={a.metrics} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= OPEN CALL FOR PAPERS ================= */}
      {openCalls.length > 0 && (
        <section className="sec" id="open-call">
          <div className="wrap">
            <div className="sec__head">
              <p className="annot">Open call for papers</p>
              <h2 className="sec__title">Submit your research</h2>
              <p className="sec__lede">
                Machine Science is currently accepting manuscripts for the following issues. Submission is free of
                charge and all papers are peer-reviewed.
              </p>
            </div>

            {openCalls.map((oc, i) => (
              <article className="feat" key={oc.id}>
                <div className="feat__no">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <span className="feat__tag">
                    Call for papers{oc.numberRoman ? ` · Number ${oc.numberRoman}` : ""}
                  </span>
                  <h3 className="feat__title">{oc.title || issueLabel(oc.year, oc.number)}</h3>
                  {oc.submissionDeadline && (
                    <p className="feat__auth">Submission deadline: {formatDate(oc.submissionDeadline)}</p>
                  )}
                  <a className="btn btn--fill" href={ADMIN_URL}>
                    <span>Submit a manuscript</span>
                    <Arrow />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
