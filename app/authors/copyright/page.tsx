import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { ADMIN_URL } from "@/lib/site";
import { IconArrow, IconCheck } from "@/components/icons";

const DESCRIPTION =
  "The copyright policy of Machine Science: authors retain copyright and publishing rights, the journal receives a non-exclusive right to publish and archive, and copyright is never transferred to the journal or to Azerbaijan Technical University.";

export const metadata: Metadata = {
  title: "Copyright Policy",
  description: DESCRIPTION,
  alternates: { canonical: "/authors/copyright" },
  keywords: [
    "copyright policy",
    "authors retain copyright",
    "non-exclusive licence",
    "Creative Commons",
    "open access",
    "Machine Science",
  ],
  openGraph: {
    type: "article",
    title: "Copyright Policy · Machine Science",
    description: DESCRIPTION,
    url: "/authors/copyright",
  },
};

/** The rights the author keeps — the substance of the policy, stated as grants. */
const AUTHOR_RIGHTS = [
  "Authors retain copyright and publishing rights to their articles published in Machine Science.",
  "Authors may use, reuse, share, distribute and archive their work in accordance with the journal's Open Access Policy and the Creative Commons licence applicable to the published article.",
  "Copyright is not transferred to Machine Science or Azerbaijan Technical University.",
];

export default function CopyrightPolicyPage() {
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Information for Authors", url: "/authors" },
            { name: "Copyright Policy", url: "/authors/copyright" },
          ]),
          webPageJsonLd({
            name: "Copyright Policy",
            url: "/authors/copyright",
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
          { name: "Copyright Policy" },
        ]}
        eyebrow="Information for authors"
        title="Copyright Policy"
        lede="Authors retain copyright and publishing rights to their articles published in Machine Science. The journal asks only for the non-exclusive rights it needs to publish, preserve and disseminate the Version of Record."
        meta={
          <>
            <span>
              Copyright held by <b>The Author(s)</b>
            </span>
            <span>
              Transfer of copyright <b>None</b>
            </span>
            <span>
              Licence to journal <b>Non-exclusive</b>
            </span>
            <span>
              Article licence <b>CC BY 4.0</b>
            </span>
          </>
        }
      />

      <section className="sec">
        <div className="wrap apg__grid">
          <div className="apg__main">
            {/* ---------------- the policy ---------------- */}
            <div className="blk rv">
              <h2 className="blk__h">Copyright Policy</h2>
              <div className="prose">
                <p>
                  Authors retain copyright and publishing rights to their articles published in{" "}
                  <b>Machine Science</b>.
                </p>
                <p>
                  By publishing in Machine Science, authors grant the journal and Azerbaijan Technical University
                  (AzTU) a non-exclusive right to publish, reproduce, distribute, archive, preserve, and make the
                  published Version of Record publicly available.
                </p>
                <p>
                  Authors may use, reuse, share, distribute, and archive their work in accordance with the journal&apos;s
                  Open Access Policy and the Creative Commons licence applicable to the published article.
                </p>
                <p>
                  <b>Copyright is not transferred</b> to Machine Science or Azerbaijan Technical University.
                </p>
                <p>
                  Authors are responsible for obtaining the necessary permissions for any copyrighted third-party
                  material included in their articles.
                </p>
              </div>

              <div className="note">
                <p className="note__h">Copyright notice</p>
                <p>© The Author(s). Published by Machine Science, Azerbaijan Technical University.</p>
              </div>
            </div>

            {/* ---------------- what the author keeps ---------------- */}
            <div className="blk rv">
              <h2 className="blk__h">
                What authors keep
                <span>{AUTHOR_RIGHTS.length}</span>
              </h2>
              <div className="terms">
                {AUTHOR_RIGHTS.map((r) => (
                  <div className="term" key={r}>
                    <span className="term__ic" aria-hidden="true">
                      <IconCheck />
                    </span>
                    <div>
                      <div className="term__d">{r}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------------- third-party material ---------------- */}
            <div className="blk rv">
              <h2 className="blk__h">Third-party material</h2>
              <div className="prose">
                <p>
                  Authors are responsible for obtaining the necessary permissions for any copyrighted third-party
                  material included in their articles — figures, tables, photographs, extended quotations, datasets,
                  instrument output or software listings reproduced from another work.
                </p>
                <p>
                  Written permission from the rightsholder should be obtained before submission and the source
                  acknowledged in the caption or reference list. Where material is reused under a Creative Commons
                  licence, the licence must be named and its attribution terms followed.
                </p>
              </div>
            </div>
          </div>

          <aside className="apg__side">
            <div className="scard">
              <div className="scard__h">In short</div>
              <dl>
                <div>
                  <dt>Copyright</dt>
                  <dd>Retained by the author(s)</dd>
                </div>
                <div>
                  <dt>Transfer to the journal</dt>
                  <dd>None</dd>
                </div>
                <div>
                  <dt>Rights granted to the journal</dt>
                  <dd>Non-exclusive: publish, reproduce, distribute, archive, preserve</dd>
                </div>
                <div>
                  <dt>Article licence</dt>
                  <dd>CC BY 4.0</dd>
                </div>
                <div>
                  <dt>Third-party permissions</dt>
                  <dd>The author&apos;s responsibility</dd>
                </div>
                <div>
                  <dt>Charges</dt>
                  <dd>None at any stage</dd>
                </div>
              </dl>
            </div>

            <div className="scard">
              <div className="scard__h">Copyright line</div>
              <pre className="cite__out">{`© The Author(s).
Published by Machine Science,
Azerbaijan Technical University.`}</pre>
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
