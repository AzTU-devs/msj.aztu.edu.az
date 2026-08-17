import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { ADMIN_URL } from "@/lib/site";
import { IconArrow, IconCheck, IconClose } from "@/components/icons";

const DESCRIPTION =
  "The generative AI policy of Machine Science: what authors, editors and peer reviewers may and may not do with tools such as ChatGPT, Copilot, Gemini, Claude, DALL·E and Midjourney, and how AI use must be disclosed.";

export const metadata: Metadata = {
  title: "AI Policy",
  description: DESCRIPTION,
  alternates: { canonical: "/authors/ai-policy" },
  keywords: [
    "AI policy",
    "generative AI",
    "large language models",
    "publishing ethics",
    "AI disclosure",
    "Machine Science",
  ],
  openGraph: {
    type: "article",
    title: "AI Policy · Machine Science",
    description: DESCRIPTION,
    url: "/authors/ai-policy",
  },
};

/** The four risks the policy names, each with the reason it matters. */
const RISKS: { title: string; body: string }[] = [
  {
    title: "Inaccuracy and bias",
    body: "Generative AI tools are of a statistical nature (as opposed to factual) and, as such, can introduce inaccuracies, falsities (so-called hallucinations) or bias, which can be hard to detect, verify and correct.",
  },
  {
    title: "Lack of attribution",
    body: "Generative AI is often lacking the standard practice of the global scholarly community of correctly and precisely attributing ideas, quotes or citations.",
  },
  {
    title: "Confidentiality and intellectual property risks",
    body: "At present, Generative AI tools are often used on third-party platforms that may not offer sufficient standards of confidentiality, data security or copyright protection.",
  },
  {
    title: "Unintended uses",
    body: "Generative AI providers may reuse the input or output data from user interactions (e.g. for AI training). This practice could potentially infringe on the rights of authors and publishers, amongst others.",
  },
];

/** Uses the journal supports, provided they are disclosed. */
const SUPPORTED = [
  "Idea generation and idea exploration",
  "Language improvement",
  "Interactive online search with LLM-enhanced search engines",
  "Literature classification",
  "Coding assistance",
];

export default function AiPolicyPage() {
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Information for Authors", url: "/authors" },
            { name: "AI Policy", url: "/authors/ai-policy" },
          ]),
          webPageJsonLd({
            name: "AI Policy",
            url: "/authors/ai-policy",
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
          { name: "AI Policy" },
        ]}
        eyebrow="Information for authors"
        title="AI Policy"
        lede="Machine Science welcomes the new opportunities offered by generative AI tools — and sets out here what authors, editors and peer reviewers may and may not do with them. This guidance may evolve given the swift development of the AI field."
        meta={
          <>
            <span>
              AI as author <b>Never</b>
            </span>
            <span>
              Disclosure <b>Required</b>
            </span>
            <span>
              Images &amp; figures <b>Not permitted</b>
            </span>
            <span>
              Manuscripts in AI tools <b>Prohibited</b>
            </span>
          </>
        }
      />

      <section className="sec">
        <div className="wrap apg__grid">
          <div className="apg__main">
            {/* ---------------- introduction ---------------- */}
            <div className="blk rv">
              <h2 className="blk__h">Introduction</h2>
              <div className="prose">
                <p>
                  Generative Artificial Intelligence (AI) tools, such as large language models (LLMs) or multimodal
                  models, continue to develop and evolve, including in their application for businesses and consumers.
                </p>
                <p>
                  Machine Science journal welcomes the new opportunities offered by generative AI tools, particularly
                  in enhancing idea generation and exploration, supporting authors to express content in a non-native
                  language, and accelerating the research and dissemination process. The journal offers guidance to
                  authors, editors and reviewers on the use of such tools, which may evolve given the swift
                  development of the AI field.
                </p>
                <p>
                  Generative AI tools can produce diverse forms of content, spanning text generation, image synthesis,
                  audio and synthetic data. Some examples include ChatGPT, Copilot, Gemini, Claude, NovelAI, Jasper AI,
                  DALL·E, Midjourney and Runway.
                </p>
                <p>
                  While generative AI has immense capabilities to enhance creativity for authors, there are certain
                  risks associated with the current generation of these tools.
                </p>
              </div>
            </div>

            {/* ---------------- risks ---------------- */}
            <div className="blk rv">
              <h2 className="blk__h">
                Risks in how generative AI works today
                <span>{RISKS.length}</span>
              </h2>
              <div className="terms">
                {RISKS.map((r) => (
                  <div className="term" key={r.title}>
                    <span className="term__ic" aria-hidden="true">
                      <IconClose />
                    </span>
                    <div>
                      <div className="term__t">{r.title}</div>
                      <p className="term__d">{r.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------------- authors ---------------- */}
            <div className="blk rv">
              <h2 className="blk__h">Authors</h2>
              <div className="prose">
                <p>
                  Authors are accountable for the originality, validity and integrity of the content of their
                  submissions. In choosing to use generative AI tools, journal authors are expected to do so
                  responsibly and in accordance with our editorial policies on authorship and our principles of
                  publishing ethics. This includes reviewing the outputs of any generative AI tools and confirming
                  content accuracy.
                </p>
                <p>
                  Machine Science journal supports the responsible use of generative AI tools that respect high
                  standards of data security, confidentiality and copyright protection, in cases such as:
                </p>
              </div>

              <div className="terms" style={{ marginTop: "1.2rem" }}>
                {SUPPORTED.map((s) => (
                  <div className="term" key={s}>
                    <span className="term__ic" aria-hidden="true">
                      <IconCheck />
                    </span>
                    <div>
                      <div className="term__t">{s}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="prose" style={{ marginTop: "1.6rem" }}>
                <p>
                  Authors are responsible for ensuring that the content of their submissions meets the required
                  standards of rigorous scientific and scholarly assessment, research and validation, and is created
                  by the author. Note that some journals may not allow use of generative AI tools beyond language
                  improvement; authors are advised to consult the editor prior to submission.
                </p>
              </div>

              <div className="note note--warn">
                <p className="note__h">AI cannot be an author</p>
                <p>
                  Generative AI tools <b>must not be listed as an author</b>, because such tools are unable to assume
                  responsibility for the submitted content or manage copyright and licensing agreements. Authorship
                  requires taking accountability for content, consenting to publication via a publishing agreement,
                  and giving contractual assurances about the integrity of the work. These are uniquely human
                  responsibilities that cannot be undertaken by generative AI tools.
                </p>
              </div>

              <div className="note">
                <p className="note__h">Required disclosure</p>
                <p>
                  Authors must clearly acknowledge within the article any use of generative AI tools through a
                  statement which includes: <b>the full name of the tool used (with version number)</b>,{" "}
                  <b>how it was used</b>, and <b>the reason for use</b>. For article submissions, this statement must
                  be included in the <b>Methods or Acknowledgments</b> section.
                </p>
                <p>
                  Book authors must disclose their intent to employ generative AI tools at the earliest possible stage
                  to their editorial contacts for approval — either at the proposal phase if known or, if necessary,
                  during the manuscript writing phase. If approved, the statement must then appear in the preface or
                  introduction of the book.
                </p>
                <p>
                  This level of transparency ensures that editors can assess whether generative AI tools have been
                  used and whether they have been used responsibly. Machine Science journal retains its discretion
                  over publication of the work, to ensure that integrity and guidelines have been upheld. These types
                  of cases may be subject to editorial investigation.
                </p>
                <p>
                  If an author intends to use an AI tool, they should ensure that the tool is appropriate and robust
                  for their proposed use, and that the terms applicable to such tool provide sufficient safeguards and
                  protections — for example around intellectual property rights, confidentiality and security.
                </p>
              </div>
            </div>

            {/* ---------------- images ---------------- */}
            <div className="blk rv">
              <h2 className="blk__h">Images, figures and research data</h2>
              <div className="prose">
                <p>
                  Machine Science journal <b>currently does not permit</b> the use of generative AI in the creation
                  and manipulation of images and figures, or original research data, for use in our publications. The
                  term “images and figures” includes pictures, charts, data tables, medical imagery, snippets of
                  images, computer code and formulas. The term “manipulation” includes augmenting, concealing, moving,
                  removing or introducing a specific feature within an image or figure.
                </p>
                <p>
                  Utilising generative AI and AI-assisted technologies in any part of the research process should
                  always be undertaken with human oversight and transparency. Research ethics guidelines are still
                  being updated regarding current generative AI technologies, and Machine Science will continue to
                  update our editorial guidelines as the technology and those guidelines evolve.
                </p>
              </div>
            </div>

            {/* ---------------- editors and reviewers ---------------- */}
            <div className="blk rv">
              <h2 className="blk__h">Editors and peer reviewers</h2>
              <div className="prose">
                <p>
                  Machine Science journal strives for the highest standards of editorial integrity and transparency.
                  Editors&apos; and peer reviewers&apos; use of manuscripts in generative AI systems may pose a risk to
                  confidentiality, proprietary rights and data, including personally identifiable information.
                  Therefore, editors and peer reviewers <b>must not upload files, images or information from
                  unpublished manuscripts into generative AI tools</b>. Failure to comply with this policy may
                  infringe upon the rightsholder&apos;s intellectual property.
                </p>

                <h3>Editors</h3>
                <p>
                  Editors are the shepherds of quality and responsible research content. Therefore, editors must keep
                  submission and peer review details confidential. Use of manuscripts in generative AI systems may give
                  rise to risks around confidentiality, infringement of proprietary rights and data, and other risks;
                  editors must not upload unpublished manuscripts, including any associated files, images or
                  information, into generative AI tools.
                </p>
                <p>
                  Editors should check with their Machine Science contact prior to using any generative AI tools,
                  unless they have already been informed that the tool and the proposed use of the tool is authorised.
                </p>

                <h3>Peer reviewers</h3>
                <p>
                  Peer reviewers are chosen experts in their fields and should not be using generative AI for analysis
                  or to summarise submitted articles, or portions thereof, in the creation of their reviews. As such,
                  peer reviewers must not upload unpublished manuscripts or project proposals, including any
                  associated files, images or information, into generative AI tools.
                </p>
                <p>
                  Generative AI may only be utilised to assist with improving review language, but peer reviewers
                  remain responsible at all times for ensuring the accuracy and integrity of their reviews.
                </p>
              </div>
            </div>
          </div>

          <aside className="apg__side">
            <div className="scard">
              <div className="scard__h">In short</div>
              <dl>
                <div>
                  <dt>AI as an author</dt>
                  <dd>Never permitted</dd>
                </div>
                <div>
                  <dt>Disclosure</dt>
                  <dd>Required, in Methods or Acknowledgments</dd>
                </div>
                <div>
                  <dt>Language improvement</dt>
                  <dd>Permitted, if disclosed</dd>
                </div>
                <div>
                  <dt>Images &amp; figures</dt>
                  <dd>Not permitted</dd>
                </div>
                <div>
                  <dt>Research data</dt>
                  <dd>Not permitted</dd>
                </div>
                <div>
                  <dt>Manuscripts in AI tools</dt>
                  <dd>Prohibited for editors and reviewers</dd>
                </div>
              </dl>
            </div>

            <div className="scard">
              <div className="scard__h">Disclosure statement</div>
              <pre className="cite__out">{`AI use statement

Tool: <name and version>
Used for: <what it was used to do>
Reason: <why it was used>`}</pre>
            </div>

            <div className="scard">
              <div className="scard__h">Also in this section</div>
              <ul className="ft__nav">
                <li>
                  <Link href="/authors">Information for Authors</Link>
                </li>
                <li>
                  <Link href="/authors/manuscript">Preparation of Manuscript</Link>
                </li>
                <li>
                  <Link href="/authors/open-access">Open access policies</Link>
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
