import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { ADMIN_URL } from "@/lib/site";
import { IconArrow, IconCheck, IconClose } from "@/components/icons";

const DESCRIPTION =
  "The terms and conditions governing use of the Machine Science website and portal: permitted use of published articles under CC BY 4.0, author undertakings on submission, account rules, and the limits of the journal's liability.";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  keywords: ["terms and conditions", "terms of use", "licence", "CC BY 4.0", "Machine Science"],
  openGraph: {
    type: "article",
    title: "Terms & Conditions · Machine Science",
    description: DESCRIPTION,
    url: "/terms",
  },
};

/** What the CC BY licence lets any reader do, without asking us. */
const PERMITTED = [
  "Read, download and print any article, without charge and without an account.",
  "Copy and redistribute articles in any medium or format, including commercially.",
  "Adapt, remix, translate and build upon the work, including for commercial purposes.",
  "Deposit the published version in a repository, a course pack or an institutional archive.",
];

/** The undertakings an author makes by submitting. */
const UNDERTAKINGS = [
  "The work is original, is the authors' own, and has not been published elsewhere.",
  "The work is not under consideration by another journal.",
  "Everyone who meets the criteria for authorship is listed, and no one who does not.",
  "Permission has been obtained for any copyrighted third-party material included.",
  "Any use of generative AI tools has been disclosed as the AI Policy requires.",
  "Sources of funding and any competing interests have been declared.",
];

export default function TermsPage() {
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Terms & Conditions", url: "/terms" },
          ]),
          webPageJsonLd({ name: "Terms & Conditions", url: "/terms", description: DESCRIPTION }),
        ]}
      />
      <Reveal />
      <noscript>
        <style>{`.rv{opacity:1 !important;transform:none !important;}`}</style>
      </noscript>

      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Terms & Conditions" }]}
        eyebrow="Legal"
        title="Terms &amp; Conditions"
        lede="These terms govern your use of the Machine Science website and of the author and reviewer portal. By using either, you accept them. They sit alongside the journal's Copyright, Open Access and AI policies rather than replacing them."
        meta={
          <>
            <span>
              Article licence <b>CC BY 4.0</b>
            </span>
            <span>
              Charges to authors <b>None</b>
            </span>
            <span>
              Copyright <b>Retained by authors</b>
            </span>
            <span>
              Governing law <b>Azerbaijan</b>
            </span>
          </>
        }
      />

      <section className="sec">
        <div className="wrap apg__grid">
          <div className="apg__main">
            <div className="blk rv">
              <h2 className="blk__h">1. About these terms</h2>
              <div className="prose">
                <p>
                  “Machine Science” is published by <b>Azerbaijan Technical University (AzTU)</b>, H. Javid ave 25,
                  Baku AZ 1073, Azerbaijan. In these terms, “the journal”, “we” and “us” mean the journal and its
                  publisher; “you” means anyone using the site or the portal.
                </p>
                <p>
                  If you do not accept these terms, please do not use the site. We may revise them from time to time;
                  the version published here is the one in force.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">
                2. Using published articles
                <span>{PERMITTED.length}</span>
              </h2>
              <div className="prose">
                <p>
                  Machine Science is fully open access. Articles are published under the{" "}
                  <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener license">
                    Creative Commons Attribution 4.0 International licence (CC BY 4.0)
                  </a>
                  , and copyright is retained by the authors. Under that licence you are free to:
                </p>
              </div>

              <div className="terms" style={{ marginTop: "1.2rem" }}>
                {PERMITTED.map((p) => (
                  <div className="term" key={p}>
                    <span className="term__ic" aria-hidden="true">
                      <IconCheck />
                    </span>
                    <div>
                      <div className="term__d">{p}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="note">
                <p className="note__h">The one condition: attribution</p>
                <p>
                  You must give appropriate credit to the original authors and to Machine Science, provide a link to
                  the licence, and indicate if changes were made. You may do so in any reasonable manner, but not in
                  any way that suggests the authors or the journal endorse you or your use.
                </p>
              </div>

              <div className="prose" style={{ marginTop: "1.6rem" }}>
                <p>
                  The licence covers the articles. It does not cover the journal&apos;s name, its logo, the AzTU
                  emblem, or the design of this website, which remain the property of their respective owners. Where an
                  article reproduces third-party material under a different licence, that material carries its own
                  terms, stated in the caption or reference.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">
                3. Submitting a manuscript
                <span>{UNDERTAKINGS.length}</span>
              </h2>
              <div className="prose">
                <p>
                  Submission is free of charge, as is review and publication — the journal levies no article
                  processing charge at any stage. By submitting, the corresponding author confirms on behalf of all
                  authors that:
                </p>
              </div>

              <div className="terms" style={{ marginTop: "1.2rem" }}>
                {UNDERTAKINGS.map((u) => (
                  <div className="term" key={u}>
                    <span className="term__ic" aria-hidden="true">
                      <IconCheck />
                    </span>
                    <div>
                      <div className="term__d">{u}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="prose" style={{ marginTop: "1.6rem" }}>
                <p>
                  Submitting does not oblige us to publish. Manuscripts are assessed by double-blind peer review and
                  the editorial decision is final. We may decline, seek revisions, or withdraw an article after
                  publication where the integrity of the record requires it — in which case a retraction or correction
                  notice is published and the original remains visible.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">4. Accounts</h2>
              <div className="prose">
                <p>
                  An account in the portal is personal to you. Keep your password confidential, use an address you
                  control, and tell us promptly if you believe your account has been accessed by someone else. You are
                  responsible for what is done through your account.
                </p>
                <p>
                  We may suspend or close an account that is used to breach these terms, to submit fraudulent or
                  plagiarised work, or to attack the service. Where an account is tied to a published article, we block
                  rather than delete it, so that the editorial record stays intact.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">5. Acceptable use</h2>
              <div className="prose">
                <p>You agree not to:</p>
              </div>

              <div className="terms" style={{ marginTop: "1.2rem" }}>
                {[
                  "Attempt to gain unauthorised access to the site, the portal, or any account other than your own.",
                  "Upload malicious files, scripts or content designed to execute on our servers or in another user's browser.",
                  "Interfere with the service, including by automated scraping that degrades it for others.",
                  "Misrepresent your identity or affiliation, or submit work that is not yours.",
                ].map((x) => (
                  <div className="term" key={x}>
                    <span className="term__ic" aria-hidden="true">
                      <IconClose />
                    </span>
                    <div>
                      <div className="term__d">{x}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="prose" style={{ marginTop: "1.6rem" }}>
                <p>
                  Metadata harvesting through our OAI-PMH interface at{" "}
                  <Link href="/oai">/oai</Link> is explicitly welcome and is the supported way to index the journal in
                  bulk.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">6. Availability and accuracy</h2>
              <div className="prose">
                <p>
                  We aim to keep the journal available continuously and its record accurate, but the site is provided
                  “as is”. We do not warrant uninterrupted access, and we may suspend the service for maintenance.
                </p>
                <p>
                  The scientific content of an article is the responsibility of its authors. Publication in Machine
                  Science does not mean the journal, its editors or AzTU endorse the findings, and nothing published
                  here should be treated as professional advice.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">7. Liability</h2>
              <div className="prose">
                <p>
                  To the extent permitted by law, AzTU and the journal are not liable for indirect or consequential
                  loss arising from use of the site, for loss of data, or for the content of any external site we link
                  to. Nothing in these terms limits liability that cannot lawfully be limited.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">8. Governing law</h2>
              <div className="prose">
                <p>
                  These terms are governed by the law of the Republic of Azerbaijan, and the courts of Azerbaijan have
                  jurisdiction over any dispute arising from them.
                </p>
                <p>
                  Questions about these terms are welcome at{" "}
                  <a href="mailto:msj@aztu.edu.az">msj@aztu.edu.az</a>.
                </p>
              </div>
            </div>
          </div>

          <aside className="apg__side">
            <div className="scard">
              <div className="scard__h">In short</div>
              <dl>
                <div>
                  <dt>Article licence</dt>
                  <dd>CC BY 4.0 — reuse freely with attribution</dd>
                </div>
                <div>
                  <dt>Copyright</dt>
                  <dd>Retained by the author(s)</dd>
                </div>
                <div>
                  <dt>Charges</dt>
                  <dd>None, at any stage</dd>
                </div>
                <div>
                  <dt>Peer review</dt>
                  <dd>Double-blind; editorial decision final</dd>
                </div>
                <div>
                  <dt>Metadata harvesting</dt>
                  <dd>Welcome, via OAI-PMH</dd>
                </div>
                <div>
                  <dt>Governing law</dt>
                  <dd>Republic of Azerbaijan</dd>
                </div>
              </dl>
            </div>

            <div className="scard">
              <div className="scard__h">Related</div>
              <ul className="ft__nav">
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/authors/copyright">Copyright Policy</Link>
                </li>
                <li>
                  <Link href="/authors/open-access">Open access policies</Link>
                </li>
                <li>
                  <Link href="/authors/ai-policy">AI Policy</Link>
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
