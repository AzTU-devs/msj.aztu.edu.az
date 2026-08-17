import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { ADMIN_URL } from "@/lib/site";
import { IconArrow, IconMail, IconUpload } from "@/components/icons";

const EMAIL = "msj@aztu.edu.az";

const DESCRIPTION =
  "How to prepare a manuscript for Machine Science: subject areas, accepted types of work, page format and font requirements, and the full checklist a submitted manuscript must satisfy. English only, 10–15 pages, free of charge.";

export const metadata: Metadata = {
  title: "Preparation of Manuscript",
  description: DESCRIPTION,
  alternates: { canonical: "/authors/manuscript" },
  keywords: [
    "manuscript preparation",
    "author guidelines",
    "submission requirements",
    "Machine Science",
    "article formatting",
  ],
  openGraph: {
    type: "article",
    title: "Preparation of Manuscript · Machine Science",
    description: DESCRIPTION,
    url: "/authors/manuscript",
  },
};

/** The subject areas the journal invites submissions on. */
const TOPICS = [
  "Mechanic",
  "Machine design",
  "Materials Science and Metallurgy",
  "Mechanical engineering technology",
  "Mechatronics and Robotics Engineering",
  "Energy and Environment",
  "Automation and ICT",
  "Economics and management (in mechanical engineering)",
];

/** Page setup, kept as a record plate so an author can check it at a glance. */
const FORMAT: [string, string][] = [
  ["Page format", "A4"],
  ["Margins", "20 mm on all four sides"],
  ["Font", "Times New Roman"],
  ["Line spacing", "1.5"],
  ["Language", "English only"],
  ["Length", "10–15 pages"],
  ["Page unit", "1 800 characters with spaces"],
];

/** "The manuscript should contain…" — the submission checklist, in order. */
const CHECKLIST = [
  "The title of the article and key words, names of authors and co-authors, their place of work and position, as well as full address, telephone number and e-mail address.",
  "Abstract of the article with 250–350 words; including what the article is about, the subject of study, methods used, results obtained and conclusions.",
  "The text of the work: abstract, introduction, theoretical analysis, research methodology, experimental part, results and discussion, conclusions, and list of literature (alphabetical order).",
  "Provide the source of research funding (e.g. research project number, commission from industry).",
  "Separately, in the literature, legal and normative acts should be referred to.",
  "Authors should attach their photo and a short biographical note (place of work, employer's address, position).",
  "If multiple authors, specify percentage share of contribution and indicate the correspondence author.",
  "Photographs, maps, charts, etc. should be prepared by authors themselves; if reprinted from other sources, obtain publisher permission (minimum format: TIFF, PNG, JPEG; minimum 300 dpi).",
  "Formulas should be typed in standard Microsoft Equation Editors; main formulas numbered on the right side.",
  "Tables should be placed in the text, numbered, and the table name indicated in the upper right corner.",
  "Scientific misconduct (concealment of contributions, plagiarism) will be disclosed, including notifying relevant entities.",
  "References should contain author, title, publisher/conference, DOI (if available), year, issue, and page numbers.",
];

export default function ManuscriptPage() {
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Information for Authors", url: "/authors" },
            { name: "Preparation of Manuscript", url: "/authors/manuscript" },
          ]),
          webPageJsonLd({
            name: "Preparation of Manuscript",
            url: "/authors/manuscript",
            description: DESCRIPTION,
          }),
        ]}
      />
      <Reveal />
      <noscript>
        <style>{`.rv{opacity:1 !important;transform:none !important;}`}</style>
      </noscript>

      <PageHeader
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Information for Authors", href: "/authors" },
          { name: "Preparation of Manuscript" },
        ]}
        eyebrow="Information for authors"
        title="Preparation of Manuscript"
        lede="We cordially invite authors to submit articles in the “MACHINE SCIENCE” journal on the topics below. Submission, review and publication are free of charge at every stage."
        meta={
          <>
            <span>
              Language <b>English</b>
            </span>
            <span>
              Length <b>10–15 pages</b>
            </span>
            <span>
              Format <b>A4 · Times New Roman · 1.5</b>
            </span>
            <span>
              Charges <b>None</b>
            </span>
          </>
        }
        actions={
          <>
            <a className="btn btn--fill" href={ADMIN_URL}>
              <span>Submit a manuscript</span>
              <IconUpload />
            </a>
            <a className="btn btn--line" href={`mailto:${EMAIL}`}>
              <span>{EMAIL}</span>
              <IconMail />
            </a>
          </>
        }
      />

      <section className="sec">
        <div className="wrap apg__grid">
          <div className="apg__main">
            {/* ---------------- subject areas ---------------- */}
            <div className="blk rv">
              <h2 className="blk__h">Subject areas</h2>
              <div className="tlist">
                {TOPICS.map((t, i) => (
                  <div className="tlist__i" key={t}>
                    <span className="tlist__n">{String(i + 1).padStart(2, "0")}</span>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* ---------------- type of work ---------------- */}
            <div className="blk rv">
              <h2 className="blk__h">Type of work</h2>
              <div className="prose">
                <p>
                  Original, informative, review and research papers are published, in line with the subject matter of
                  the journal, with the volume of articles from <b>10 to 15 pages</b> (1 page = 1 800 characters with
                  spaces) plus original drawings, charts, tables and other material prepared by the author.
                </p>
              </div>

              <div className="note">
                <p className="note__h">How to submit</p>
                <p>
                  Send your article in <b>both</b> .doc and .pdf versions, together with images, photographs and
                  figures in high resolution (<b>minimum 300 dpi</b>) and any other material, to the editorial
                  address: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
                </p>
                <p>
                  Submissions may also be started in the <a href={ADMIN_URL}>author portal</a>, which issues a
                  tracking number and carries the manuscript through peer review.
                </p>
              </div>
            </div>

            {/* ---------------- checklist ---------------- */}
            <div className="blk rv">
              <h2 className="blk__h">
                Preparation of manuscript
                <span>{CHECKLIST.length} requirements</span>
              </h2>
              <div>
                {CHECKLIST.map((item, i) => (
                  <div className="step step--plain" key={i}>
                    <div className="step__n">{String(i + 1).padStart(2, "0")}</div>
                    <p className="step__d">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="note note--warn rv">
              <p className="note__h">Publication ethics</p>
              <p>
                Scientific misconduct — concealment of contributions, plagiarism — will be disclosed, including
                notification of the relevant entities. See the{" "}
                <Link href="/authors/ai-policy">AI Policy</Link> for the rules on generative AI, and the{" "}
                <Link href="/authors/open-access">open access policies</Link> for licensing and re-use.
              </p>
            </div>
          </div>

          {/* ---------------- formatting plate ---------------- */}
          <aside className="apg__side">
            <div className="scard">
              <div className="scard__h">Requirements for formatting</div>
              <dl>
                {FORMAT.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="scard">
              <div className="scard__h">Files to send</div>
              <dl>
                <div>
                  <dt>Manuscript</dt>
                  <dd>.doc and .pdf</dd>
                </div>
                <div>
                  <dt>Figures</dt>
                  <dd>TIFF, PNG or JPEG · min. 300 dpi</dd>
                </div>
                <div>
                  <dt>Author photo</dt>
                  <dd>with a short biographical note</dd>
                </div>
                <div>
                  <dt>Send to</dt>
                  <dd>
                    <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="scard">
              <div className="scard__h">Also in this section</div>
              <ul className="ft__nav">
                <li>
                  <Link href="/authors">Information for Authors</Link>
                </li>
                <li>
                  <Link href="/authors/open-access">Open access policies</Link>
                </li>
                <li>
                  <Link href="/authors/ai-policy">AI Policy</Link>
                </li>
                <li>
                  <Link href="/scope">Aim &amp; scope</Link>
                </li>
              </ul>
              <p style={{ margin: "1.1rem 0 0" }}>
                <a className="btn btn--fill" href={ADMIN_URL}>
                  <span>Submit</span>
                  <IconArrow />
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
