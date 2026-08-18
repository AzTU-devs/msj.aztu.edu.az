import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { api, text, type Home } from "@/lib/api";
import { JsonLd, journalJsonLd } from "@/lib/seo";
import {
  FOUNDED,
  ISSN_ONLINE,
  ISSN_PRINT,
  PUBLISHER,
  formatDate,
  issueLabel,
  issueParts,
  toRoman,
} from "@/lib/journal";
import HeroSlider, { type HeroSlide } from "@/components/HeroSlider";
import IssueCover from "@/components/IssueCover";
import Toc from "@/components/Toc";
import CardMetrics from "@/components/CardMetrics";
import Reveal from "@/components/Reveal";
import { scopeIcon } from "@/components/scopeIcons";
import { getLocale } from "@/lib/locale";
import { ui } from "@/lib/i18n";
import {
  IconArchive,
  IconArrow,
  IconBook,
  IconCheck,
  IconDownload,
  IconMail,
  IconPhone,
  IconPin,
  IconQuote,
  IconUpload,
} from "@/components/icons";
// Author sign-in / manuscript submission live in the portal
// (admin-msj.aztu.edu.az); the public site only links out to it.
import { ADMIN_URL } from "@/lib/site";

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

// SSR revalidated by the underlying api.home() fetch (300s). If the backend is
// unreachable we still render a clean, complete shell.
async function loadHome(): Promise<Home | null> {
  try {
    return await api.home();
  } catch {
    return null;
  }
}

/** Strip tags from backend HTML so an announcement can be clamped safely. */
function plain(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default async function HomePage() {
  const locale = await getLocale();
  const T = ui(locale);
  const home = await loadHome();
  const tx = home?.texts ?? {};
  // Editor-supplied label first, then the built-in translation for this locale.
  const t = (key: string, fallback: string) => text(tx[key], locale) || fallback;
  const settings = home?.settings;

  // --- hero -----------------------------------------------------------------
  const heroSlides: HeroSlide[] = (home?.heroSlides ?? []).map((s) => ({
    imageUrl: s.imageUrl,
    altText: s.altText ?? "",
    caption: text(s.caption, locale),
  }));
  const heroLede = text(tx["hero.lede"], locale);

  const current = home?.currentIssue ?? null;
  const currentSlug = current?.issue?.slug;
  const readCurrentHref = currentSlug ? `/issues/${currentSlug}` : "/archive";

  const archive = home?.archive ?? [];
  const issuesOnline = archive.length;
  const board = home?.board ?? [];

  // --- credentials rail -----------------------------------------------------
  // settings.ticker is the editor-curated version; otherwise assemble the same
  // facts from the journal record so the strip is never empty.
  // Editor-curated rows for this language, falling back to the English set.
  const tickerRows = settings?.ticker?.[locale] ?? settings?.ticker?.en;
  const railItems: [string, string][] =
    tickerRows && tickerRows.length
      ? tickerRows
      : [
          [T.publishedSince, String(FOUNDED)],
          [T.issn, settings?.issnPrint || ISSN_PRINT],
          [T.eIssn, settings?.issnOnline || ISSN_ONLINE],
          [T.openAccess, "CC BY 4.0"],
          [T.peerReview, T.doubleBlind],
          [T.charges, T.none],
          ...(settings?.indexedIn ?? []).map((n) => [T.indexedIn, n] as [string, string]),
          [T.publisher, settings?.publisher || PUBLISHER],
        ];

  // --- about intro ----------------------------------------------------------
  const aboutParas = Object.keys(tx)
    .filter((k) => /^about\.p\d+$/.test(k))
    .sort((a, b) => Number(a.slice(7)) - Number(b.slice(7)))
    .map((k) => text(tx[k], locale))
    .filter(Boolean);
  const aboutFallback = text(settings?.about, locale);
  const aboutBody = (aboutParas.length ? aboutParas : aboutFallback ? [aboutFallback] : []).slice(0, 3);

  // Journal record plate — the editor-supplied rows, else the essentials.
  const recordRows: [string, string][] =
    settings?.record?.[locale]?.length
      ? settings.record[locale]!
      : settings?.record?.en?.length
      ? settings.record.en
      : [
          [T.publisher, settings?.publisher || PUBLISHER],
          [T.issnPrint, settings?.issnPrint || ISSN_PRINT],
          [T.issnOnline, settings?.issnOnline || ISSN_ONLINE],
          ...(settings?.doiPrefix ? ([[T.doiPrefix, settings.doiPrefix]] as [string, string][]) : []),
          [T.frequency, T.twiceAYear],
          [T.language_, T.english],
        ];

  const indexedIn = settings?.indexedIn ?? [];

  // --- current issue --------------------------------------------------------
  const ciArticles = current?.articles ?? [];
  const featured = ciArticles[0];
  const restArticles = ciArticles.slice(1);

  // --- the rest of the feed -------------------------------------------------
  const scopeTopics = (home?.scopeTopics ?? []).slice(0, 8);
  const announcements = (home?.announcements ?? []).slice(0, 3);
  const openCalls = home?.openCalls ?? [];
  const leads = [
    ...board.filter((m) => m.section === "EDITOR_IN_CHIEF"),
    ...board.filter((m) => m.section === "HONORARY"),
  ];
  const members = board.filter((m) => m.section === "BOARD");
  const archivePreview = archive.slice(0, 6);

  const email = settings?.email || "msj@aztu.edu.az";
  const phone = settings?.phone || "(+994 12) 539-12-25";
  const address = text(settings?.address, locale) || "H. Javid ave 25, Baku AZ 1073";

  return (
    <main id="top">
      <JsonLd data={journalJsonLd()} />
      <Reveal />

      {/* ================= HERO ================= */}
      <HeroSlider slides={heroSlides}>
        <div className="wrap hero__in">
          <div className="hero__col">
            <p className="annot hero__eyebrow">{t("hero.eyebrow", T.heroEyebrow)}</p>

            <h1 className="masthead" lang="en">
              <span className="ln ln--1">
                <span>Machine</span>
              </span>
              <span className="ln ln--2">
                <span>Science</span>
              </span>
            </h1>

            {heroLede ? (
              <p className="hero__lede" dangerouslySetInnerHTML={{ __html: heroLede }} />
            ) : (
              <p className="hero__lede">{T.heroLede}</p>
            )}

            <div className="hero__cta">
              <Link className="btn btn--fill" href={readCurrentHref}>
                <span>{t("hero.cta1", T.readCurrentIssue)}</span>
                <IconArrow />
              </Link>
              <a className="btn btn--line" href={ADMIN_URL}>
                {t("hero.cta2", T.submitManuscript)}
              </a>
            </div>

            <div className="specs">
              <div className="spec">
                <div className="spec__v">{FOUNDED}</div>
                <div className="spec__k">{t("spec.since", T.publishedSince)}</div>
              </div>
              <div className="spec">
                <div className="spec__v">{issuesOnline || 9}</div>
                <div className="spec__k">{t("spec.issues", T.issuesOnline)}</div>
              </div>
              <div className="spec">
                <div className="spec__v">{t("spec.free", T.free)}</div>
                <div className="spec__k">{t("spec.cost", T.costToAuthors)}</div>
              </div>
            </div>
          </div>
        </div>
      </HeroSlider>

      {/* ================= CREDENTIALS RAIL ================= */}
      <div className="rail" aria-hidden="true">
        <div className="rail__track">
          {/* rendered twice: the -50% marquee needs two identical halves */}
          {[0, 1].map((half) =>
            railItems.map(([k, v], i) => (
              <span className="rail__item" key={`${half}-${i}`}>
                {k} <b>{v}</b>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ================= CURRENT ISSUE ================= */}
      {current && (
        <section className="sec" id="current">
          <div className="wrap">
            <div className="sec__head row rv">
              <div>
                <p className="annot">{t("current.label", T.currentIssue)}</p>
                <h2 className="sec__title">{issueLabel(current.issue.year, current.issue.number)}</h2>
                {current.issue.description && <p className="sec__lede">{current.issue.description}</p>}
              </div>
              <Link className="sec__more" href="/archive">
                {t("current.browse", T.browseArchive)}
                <IconArrow />
              </Link>
            </div>

            <div className="spot rv">
              <div className="spot__aside">
                <Link className="cover-link" href={readCurrentHref} aria-label={`Open ${current.issue.title}`}>
                  <IssueCover issue={current.issue} eager />
                </Link>

                <aside className="plate plate--flush" aria-label="Issue record">
                  <div className="plate__hd">{T.issueRecord}</div>
                  <dl>
                    {current.issue.volume != null && (
                      <>
                        <dt>{T.volume}</dt>
                        <dd>{current.issue.volume}</dd>
                      </>
                    )}
                    {current.issue.number != null && (
                      <>
                        <dt>{T.number}</dt>
                        <dd>{toRoman(current.issue.number)}</dd>
                      </>
                    )}
                    <dt>{T.year}</dt>
                    <dd>{current.issue.year}</dd>
                    <dt>{T.articles}</dt>
                    <dd>{ciArticles.length}</dd>
                    {current.issue.publishedAt && (
                      <>
                        <dt>{T.published}</dt>
                        <dd>{formatDate(current.issue.publishedAt)}</dd>
                      </>
                    )}
                    {current.issue.doi && (
                      <>
                        <dt>{T.doi}</dt>
                        <dd>
                          <a href={`https://doi.org/${current.issue.doi}`} target="_blank" rel="noopener">
                            {current.issue.doi}
                          </a>
                        </dd>
                      </>
                    )}
                  </dl>
                </aside>
              </div>

              <div className="spot__body">
                {featured && (
                  <Link className="feat" href={`/articles/${featured.id}`}>
                    <div className="feat__no">01</div>
                    <div>
                      <span className="feat__tag">
                        {T.featured}{featured.subjectArea ? ` · ${featured.subjectArea}` : ""}
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

                <Toc articles={restArticles} offset={1} />

                <div className="spot__acts">
                  {current.issue.fullPdfUrl && (
                    <a className="btn btn--fill" href={current.issue.fullPdfUrl} target="_blank" rel="noopener">
                      <span>{T.downloadFullIssue}</span>
                      <IconDownload />
                    </a>
                  )}
                  <Link className="btn btn--line" href={readCurrentHref}>
                    <span>{T.openTheIssue}</span>
                    <IconArrow />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= QUICK ACTIONS ================= */}
      <section className="sec sec--tight">
        <div className="wrap">
          <div className="quick rv">
            <Link className="qcard" href={readCurrentHref}>
              <span className="qcard__ic" aria-hidden="true">
                <IconBook />
              </span>
              <span className="qcard__t">
                {T.qcRead} <IconArrow />
              </span>
              <p className="qcard__d">{T.qcReadBody}</p>
            </Link>

            <a className="qcard" href={ADMIN_URL}>
              <span className="qcard__ic" aria-hidden="true">
                <IconUpload />
              </span>
              <span className="qcard__t">
                {T.qcSubmit} <IconArrow />
              </span>
              <p className="qcard__d">{T.qcSubmitBody}</p>
            </a>

            <Link className="qcard" href="/archive">
              <span className="qcard__ic" aria-hidden="true">
                <IconArchive />
              </span>
              <span className="qcard__t">
                {T.qcArchive} <IconArrow />
              </span>
              <p className="qcard__d">{T.qcArchiveBody}</p>
            </Link>

            <Link className="qcard" href="/authors">
              <span className="qcard__ic" aria-hidden="true">
                <IconQuote />
              </span>
              <span className="qcard__t">
                {T.qcAuthors} <IconArrow />
              </span>
              <p className="qcard__d">{T.qcAuthorsBody}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ABOUT + JOURNAL RECORD ================= */}
      {(aboutBody.length > 0 || recordRows.length > 0) && (
        <section className="sec sec--alt" id="about">
          <div className="wrap">
            <div className="sec__head rv">
              <p className="annot">{t("about.label", T.aboutTheJournal)}</p>
              <h2 className="sec__title">{t("about.title", T.aboutTitle)}</h2>
            </div>

            <div className="about">
              <div className="about__body rv">
                {aboutBody.map((p, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
                ))}
                <p>
                  <Link className="btn btn--line" href="/about">
                    <span>{T.readMore}</span>
                    <IconArrow />
                  </Link>
                </p>
              </div>

              <div className="about__side rv">
                <aside className="plate" aria-label="Journal record">
                  <div className="plate__hd">{t("plate.hd", T.journalRecord)}</div>
                  <dl>
                    {recordRows.map(([k, v], i) => (
                      <Fragment key={i}>
                        <dt dangerouslySetInnerHTML={{ __html: k }} />
                        <dd dangerouslySetInnerHTML={{ __html: v }} />
                      </Fragment>
                    ))}
                  </dl>
                </aside>

                {indexedIn.length > 0 && (
                  <aside className="plate" aria-label="Indexing">
                    <div className="plate__hd">{T.indexedIn}</div>
                    <div className="badges">
                      {indexedIn.map((name) => (
                        <span className="badge" key={name}>
                          <IconCheck />
                          {name}
                        </span>
                      ))}
                    </div>
                  </aside>
                )}

                <div className="stats">
                  <div className="stat">
                    <div className="stat__v">{issuesOnline || "—"}</div>
                    <div className="stat__k">{T.issuesOnline}</div>
                  </div>
                  <div className="stat">
                    <div className="stat__v">{board.length || "—"}</div>
                    <div className="stat__k">{T.boardLabel}</div>
                  </div>
                  <div className="stat">
                    <div className="stat__v">100%</div>
                    <div className="stat__k">{T.openAccess}</div>
                  </div>
                  <div className="stat">
                    <div className="stat__v">0 ₼</div>
                    <div className="stat__k">{T.charges}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= SCOPE ================= */}
      {scopeTopics.length > 0 && (
        <section className="sec" id="scope">
          <div className="wrap">
            <div className="sec__head row rv">
              <div>
                <p className="annot">{t("scope.label", T.scopeLabel)}</p>
                <h2 className="sec__title">{t("scope.title", T.scopeTitle)}</h2>
              </div>
              <Link className="sec__more" href="/scope">
                {T.allSubjectAreas}
                <IconArrow />
              </Link>
            </div>

            <div className="scope rv">
              {scopeTopics.map((topic, i) => (
                <div className="scope__c" key={topic.id ?? i}>
                  <span className="scope__ic" aria-hidden="true">
                    {scopeIcon(topic.icon)}
                  </span>
                  <div className="scope__n">{text(topic.title, locale)}</div>
                  <p className="scope__d">{text(topic.description, locale)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= ANNOUNCEMENTS ================= */}
      {announcements.length > 0 && (
        <section className="sec sec--alt" id="news">
          <div className="wrap">
            <div className="sec__head rv">
              <p className="annot">{T.announcements}</p>
              <h2 className="sec__title">{T.announcementsTitle}</h2>
            </div>

            <div className="news rv">
              {announcements.map((a) => {
                const body = plain(text(a.body, locale));
                return (
                  <article className="ncard" key={a.id}>
                    {a.publishedAt && <div className="ncard__d">{formatDate(a.publishedAt)}</div>}
                    <h3 className="ncard__t">{text(a.title, locale)}</h3>
                    {body && <p className="ncard__b clamp-4">{body}</p>}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ================= OPEN CALL FOR PAPERS ================= */}
      {openCalls.length > 0 && (
        <section className="sec" id="open-call">
          <div className="wrap">
            <div className="sec__head rv">
              <p className="annot">{T.openCall}</p>
              <h2 className="sec__title">{T.openCallTitle}</h2>
              <p className="sec__lede">{T.openCallLede}</p>
            </div>

            <div className="rv">
              {openCalls.map((oc, i) => (
                <article className="feat" key={oc.id}>
                  <div className="feat__no">{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <span className="feat__tag">
                      {T.callForPapers}{oc.numberRoman ? ` · ${T.number} ${oc.numberRoman}` : ""}
                    </span>
                    <h3 className="feat__title">{oc.title || issueLabel(oc.year, oc.number)}</h3>
                    {oc.submissionDeadline && (
                      <p className="feat__auth">{T.submissionDeadline}: {formatDate(oc.submissionDeadline)}</p>
                    )}
                    <a className="btn btn--fill" href={ADMIN_URL}>
                      <span>{T.submitManuscript}</span>
                      <IconArrow />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= EDITORIAL BOARD ================= */}
      {board.length > 0 && (
        <section className="sec sec--alt" id="board">
          <div className="wrap">
            <div className="sec__head row rv">
              <div>
                <p className="annot">{T.boardLabel}</p>
                <h2 className="sec__title">{T.boardTitle}</h2>
              </div>
              <Link className="sec__more" href="/board">
                {T.theFullBoard}
                <IconArrow />
              </Link>
            </div>

            {leads.length > 0 && (
              <div className="board rv">
                {leads.map((m) => (
                  <div className="ed" key={m.id}>
                    <div className="ed__av">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {m.photoUrl ? <img src={m.photoUrl} alt={m.fullName} loading="lazy" decoding="async" /> : null}
                    </div>
                    <div>
                      <div className="ed__role">
                        {m.section === "EDITOR_IN_CHIEF" ? "Editor-in-Chief" : "Honorary Editor"}
                      </div>
                      <div className="ed__n">{m.fullName}</div>
                      {m.title ? <p className="ed__t">{m.title}</p> : null}
                      {m.country ? <p className="ed__ct">{m.country}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {members.length > 0 && (
              <div className="members rv">
                <div className="members__hd">
                  {T.editorsAndReviewers} — {members.length} {T.inTotal}
                </div>
                <div className="members__grid">
                  {members.slice(0, 10).map((m) => (
                    <figure className="mem" key={m.id}>
                      <div className="mem__ph">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {m.photoUrl ? <img src={m.photoUrl} alt={m.fullName} loading="lazy" decoding="async" /> : null}
                      </div>
                      <figcaption>
                        {m.country ? <p className="mem__c">{m.country}</p> : null}
                        <div className="mem__n">{m.fullName}</div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= ARCHIVE PREVIEW ================= */}
      {archivePreview.length > 0 && (
        <section className="sec" id="archive">
          <div className="wrap">
            <div className="sec__head row rv">
              <div>
                <p className="annot">{T.archiveLabel}</p>
                <h2 className="sec__title">{T.archiveTitle}</h2>
                <p className="sec__lede">{T.archiveLede}</p>
              </div>
              <Link className="sec__more" href="/archive">
                {issuesOnline} {T.numbers}
                <IconArrow />
              </Link>
            </div>

            <div className="aprev rv">
              {archivePreview.map((iss) => (
                <Link className="acard" href={`/issues/${iss.slug}`} key={iss.id}>
                  <IssueCover issue={iss} />
                  <span className="acard__t">{issueLabel(iss.year, iss.number)}</span>
                  <p className="acard__m">
                    {issueParts(iss) || T.fullTextPdf}
                    <IconArrow />
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= CONTACT ================= */}
      <section className="cta" id="contact">
        <div className="wrap cta__in">
          <div className="rv">
            <p className="annot">{t("contact.label", T.contactLabel)}</p>
            <h2
              className="cta__t"
              dangerouslySetInnerHTML={{
                __html: t("contact.title", T.contactTitle),
              }}
            />
            <p className="cta__d">
              {t(
"contact.lede", T.contactLede)}
            </p>
            <a className="btn btn--fill" href={`mailto:${email}`}>
              <span>{t("contact.cta", T.writeToEditors)}</span>
              <IconArrow />
            </a>
          </div>

          <div className="cards rv">
            <a className="card" href={`mailto:${email}`}>
              <span className="card__ic" aria-hidden="true">
                <IconMail />
              </span>
              <span>
                <span className="card__k">{t("card.email", "E-mail")}</span>
                <span className="card__v">{email}</span>
              </span>
            </a>

            <a className="card" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
              <span className="card__ic" aria-hidden="true">
                <IconPhone />
              </span>
              <span>
                <span className="card__k">{t("card.phone", "Telephone")}</span>
                <span className="card__v">{phone}</span>
              </span>
            </a>

            <Link className="card" href="/contact">
              <span className="card__ic" aria-hidden="true">
                <IconPin />
              </span>
              <span>
                <span className="card__k">{t("card.office", "Editorial office")}</span>
                <span className="card__v">{address}</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
