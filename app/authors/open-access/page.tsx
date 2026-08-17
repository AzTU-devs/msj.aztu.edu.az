import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { ADMIN_URL } from "@/lib/site";
import { IconArrow, IconCheck, IconMail } from "@/components/icons";

const EMAIL = "msj@aztu.edu.az";

const DESCRIPTION =
  "Open access policies of Machine Science: fully Gold Open Access under a Creative Commons licence, published by Azerbaijan Technical University with no publishing fee for authors. Includes the six-month repository embargo, social sharing and preprint policy.";

export const metadata: Metadata = {
  title: "Open access policies",
  description: DESCRIPTION,
  alternates: { canonical: "/authors/open-access" },
  keywords: [
    "open access policy",
    "Gold Open Access",
    "Creative Commons",
    "no article processing charge",
    "preprint policy",
    "Machine Science",
  ],
  openGraph: {
    type: "article",
    title: "Open access policies · Machine Science",
    description: DESCRIPTION,
    url: "/authors/open-access",
  },
};

/** The policy in record form — what a librarian or funder checks first. */
const RECORD: [string, string][] = [
  ["Model", "Gold Open Access"],
  ["Licence", "Creative Commons"],
  ["Author choice", "Any of the six CC licences"],
  ["Publishing fee", "None"],
  ["APC", "None"],
  ["Publisher", "Azerbaijan Technical University"],
  ["Repository embargo", "Six months"],
  ["Preprints", "Allowed, any time"],
];

export default function OpenAccessPage() {
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Information for Authors", url: "/authors" },
            { name: "Open access policies", url: "/authors/open-access" },
          ]),
          webPageJsonLd({
            name: "Open access policies",
            url: "/authors/open-access",
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
          { name: "Open access policies" },
        ]}
        eyebrow="Information for authors"
        title="Open access policies"
        lede="Open access has become an important way to make research findings freely available for anyone to access and view. Machine Science is committed to Gold Open Access publishing, ensuring that all articles are freely available to the global research community."
        meta={
          <>
            <span>
              Model <b>Gold Open Access</b>
            </span>
            <span>
              Licence <b>Creative Commons</b>
            </span>
            <span>
              Publishing fee <b>None</b>
            </span>
            <span>
              Embargo <b>Six months</b>
            </span>
          </>
        }
        actions={
          <a className="btn btn--line" href={`mailto:${EMAIL}`}>
            <span>Open access enquiries</span>
            <IconMail />
          </a>
        }
      />

      <section className="sec">
        <div className="wrap apg__grid">
          <div className="apg__main">
            <div className="blk rv">
              <h2 className="blk__h">Our commitment</h2>
              <div className="prose">
                <p>
                  Open access (OA) serves authors and the wider community by publishing high-quality, peer-reviewed OA
                  content. We support and promote all forms of OA that are financially sustainable.
                </p>
                <p>
                  The Machine Science journal is committed to <b>Gold Open Access</b> publishing, ensuring that all
                  articles are freely available to the global research community. We collaborate with academic and
                  professional institutions to promote open access and support the dissemination of high-quality
                  research across engineering and technological disciplines. Our Gold OA model enables authors to meet
                  the open-access requirements of leading research funding bodies while maximising the visibility,
                  accessibility and impact of their work.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">Open access options</h2>
              <div className="prose">
                <p>
                  This journal is a fully open access journal, which means all articles are published as Gold Open
                  Access under a Creative Commons licence. This enables anyone to access and redistribute the content
                  and, depending upon the licence, re-use the content in new or derivative works with attribution. The
                  terms of re-use for Gold Open Access content are stated in the copyright line of the article.
                </p>
                <p>
                  Authors may choose <b>any of the six Creative Commons licences</b> when publishing Gold Open Access
                  in this journal.
                </p>
              </div>

              <div className="note note--warn">
                <p className="note__h">Editorial independence</p>
                <p>
                  The decision whether to accept a paper for publication rests solely with the Editor, and without
                  reference to the funding situation of the authors. The Editor, editorial board members and reviewers
                  have no involvement with funding support for Gold OA and cannot grant APC discounts or waivers,
                  which shall be assessed and provided by AzTU.
                </p>
              </div>

              <div className="note">
                <p className="note__h">No charge to authors</p>
                <p>
                  The international scientific and technical journal “MACHINE SCIENCE” is published by{" "}
                  <a href="https://aztu.edu.az" target="_blank" rel="noopener">
                    Azerbaijan Technical University
                  </a>{" "}
                  and there is <b>no publishing fee for authors</b>.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">Other routes to open access</h2>
              <div className="prose">
                <p>
                  If you have open access questions which are not answered by our OA policy, please contact{" "}
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
                </p>
                <p>
                  This journal follows the Open Access policy for scientific, technical and medical journals, which
                  means an <b>embargo of six months</b> applies before authors can make accepted manuscripts available
                  in non-commercial repositories. The embargo period starts from the date the article&apos;s Version of
                  Record is published online by Machine Science.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">Social sharing</h2>
              <div className="prose">
                <p>
                  A redaction of the journal initiative allows a read-only version of a final published PDF (the
                  Version of Record) to be shared and easily accessed by anyone. Core Share links, and Core Share PDFs
                  containing the links, can be freely shared on social media sites and scholarly collaboration
                  networks to enhance both the impact and discoverability of research.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">Preprint policy</h2>
              <div className="prose">
                <p>
                  A preprint is an early version of an article prior to the version accepted for publication in a
                  journal. This journal <b>allows preprints to be posted anywhere at any time</b>, including before
                  submission to the journal.
                </p>
              </div>
            </div>
          </div>

          <aside className="apg__side">
            <div className="scard">
              <div className="scard__h">Policy at a glance</div>
              <dl>
                {RECORD.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="scard">
              <div className="scard__h">What this means for you</div>
              <div className="badges">
                <span className="badge">
                  <IconCheck />
                  Free to publish
                </span>
                <span className="badge">
                  <IconCheck />
                  Free to read
                </span>
                <span className="badge">
                  <IconCheck />
                  You keep copyright
                </span>
                <span className="badge">
                  <IconCheck />
                  Funder compliant
                </span>
              </div>
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
