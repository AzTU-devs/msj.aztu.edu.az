import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { IconCheck } from "@/components/icons";

const DESCRIPTION =
  "The privacy policy of Machine Science: what personal data the journal collects from readers, authors and reviewers, why it is collected, how long it is kept, who it is shared with, and how to exercise your rights over it.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  keywords: ["privacy policy", "data protection", "personal data", "cookies", "Machine Science"],
  openGraph: {
    type: "article",
    title: "Privacy Policy · Machine Science",
    description: DESCRIPTION,
    url: "/privacy",
  },
};

/** The commitments that decide every other clause below. */
const PRINCIPLES = [
  "We collect the minimum needed to run a scholarly journal — nothing is gathered "
    + "“in case it is useful later”.",
  "We do not sell, rent or trade personal data, and we run no advertising or third-party tracking network.",
  "Names and affiliations published with an article are public by the nature of scholarly publishing; "
    + "everything else stays internal to the editorial process.",
];

export default function PrivacyPage() {
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Privacy Policy", url: "/privacy" },
          ]),
          webPageJsonLd({ name: "Privacy Policy", url: "/privacy", description: DESCRIPTION }),
        ]}
      />
      <Reveal />
      <noscript>
        <style>{`.rv{opacity:1 !important;transform:none !important;}`}</style>
      </noscript>

      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Privacy Policy" }]}
        eyebrow="Legal"
        title="Privacy Policy"
        lede="Machine Science is published by Azerbaijan Technical University. This policy explains what personal data the journal holds about readers, authors, reviewers and editors, why it is held, and what you can ask us to do with it."
        meta={
          <>
            <span>
              Data controller <b>AzTU</b>
            </span>
            <span>
              Advertising trackers <b>None</b>
            </span>
            <span>
              Data sold <b>Never</b>
            </span>
            <span>
              Contact <b>msj@aztu.edu.az</b>
            </span>
          </>
        }
      />

      <section className="sec">
        <div className="wrap apg__grid">
          <div className="apg__main">
            <div className="blk rv">
              <h2 className="blk__h">Who we are</h2>
              <div className="prose">
                <p>
                  “Machine Science” is an international scientific and technical journal published by{" "}
                  <b>Azerbaijan Technical University (AzTU)</b>, H. Javid ave 25, Baku AZ 1073, Azerbaijan. AzTU is the
                  data controller for the personal data described in this policy. The editorial office can be reached
                  at <a href="mailto:msj@aztu.edu.az">msj@aztu.edu.az</a>.
                </p>
                <p>
                  This policy covers the public journal site and the author and reviewer portal used to submit and
                  review manuscripts.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">
                Our principles
                <span>{PRINCIPLES.length}</span>
              </h2>
              <div className="terms">
                {PRINCIPLES.map((p) => (
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
            </div>

            <div className="blk rv">
              <h2 className="blk__h">What we collect, and why</h2>
              <div className="prose">
                <h3>Readers</h3>
                <p>
                  You can read the entire journal without an account and without identifying yourself. When a page or
                  a PDF is opened we record an anonymous usage event — the article concerned, the date, the
                  approximate country, the referring page and the browser&apos;s user-agent string — so that we can
                  report how often work published with us is read and downloaded. These counts are what appear as
                  “views” and “downloads” on an article page.
                </p>
                <p>
                  IP addresses are used to derive the country and to stop a single visitor inflating a counter. They
                  are not used to build a profile of you and are not linked to an account.
                </p>

                <h3>Correspondents</h3>
                <p>
                  If you write to us through the contact form we receive your name, e-mail address and message. We use
                  them to answer you and to keep a record of the correspondence.
                </p>

                <h3>Authors, reviewers and editors</h3>
                <p>
                  Holding an account in the portal means we store the details you enter: name, academic title, degree,
                  position, affiliation, country, city, postal code, telephone, e-mail, ORCID and any other identifiers
                  you supply. We use them to run peer review, to correspond with you about a manuscript, to attribute
                  published work, and to meet the metadata requirements of indexing services.
                </p>
                <p>
                  Manuscripts, supplementary files, cover letters, referee reports and editorial decisions are stored
                  as part of the editorial record of the journal.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">Lawful basis</h2>
              <div className="prose">
                <p>
                  We process personal data because it is necessary to perform the service you have asked us for —
                  publishing, reviewing or corresponding — and because AzTU has a legitimate interest in operating a
                  scholarly journal, maintaining an accurate publication record and reporting readership. Where we ask
                  for consent, you may withdraw it at any time.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">What is published</h2>
              <div className="prose">
                <p>
                  Scholarly publishing is public by design. When an article is published, the author names,
                  affiliations, countries, ORCID identifiers and the corresponding author&apos;s e-mail address are
                  published with it and are distributed to indexing and abstracting services, to Crossref with the DOI,
                  and to any harvester that collects our metadata.
                </p>
                <p>
                  Peer review is double-blind. Reviewer identities are not disclosed to authors, and reviewer reports
                  are not published.
                </p>
              </div>

              <div className="note note--warn">
                <p className="note__h">Published metadata cannot be recalled</p>
                <p>
                  Once an article and its metadata are distributed to third-party indexes, we cannot withdraw them from
                  those services. Corrections to the published record are made through a correction or erratum rather
                  than by deletion.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">Who we share data with</h2>
              <div className="prose">
                <p>
                  We share personal data only where it is necessary: with editors and peer reviewers handling a
                  manuscript; with Crossref for DOI registration and with indexing services, as described above; and
                  with the university&apos;s IT providers who host the site and send our e-mail on our behalf.
                </p>
                <p>We do not sell, rent or trade personal data, and we do not run advertising networks on this site.</p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">Cookies and local storage</h2>
              <div className="prose">
                <p>
                  The public site sets no advertising or analytics cookies. It stores one preference in your
                  browser&apos;s local storage — the light or dark theme you chose — which never leaves your device and
                  can be cleared through your browser.
                </p>
                <p>
                  The portal stores the sign-in tokens that keep you logged in. Clearing your browser storage or
                  signing out removes them.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">How long we keep it</h2>
              <div className="prose">
                <p>
                  The published record — articles, their metadata and the editorial history behind them — is kept
                  permanently, because a journal of record must remain verifiable. Correspondence is kept as long as it
                  is useful to the editorial office. Anonymous usage events are kept in aggregate. An account that is
                  no longer used can be closed on request.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">Your rights</h2>
              <div className="prose">
                <p>
                  You may ask us for a copy of the personal data we hold about you, ask us to correct it, ask us to
                  delete it, or object to how we use it. Write to{" "}
                  <a href="mailto:msj@aztu.edu.az">msj@aztu.edu.az</a> and we will respond within a reasonable period.
                </p>
                <p>
                  Where a request concerns data that forms part of the published scholarly record, we will explain what
                  we can and cannot change, and offer a correction notice where that is the appropriate remedy.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">Security</h2>
              <div className="prose">
                <p>
                  Traffic to the journal and the portal is encrypted in transit. Passwords are stored only as salted
                  hashes and are never readable by us. Access to manuscripts and reviewer reports is limited to the
                  editors and reviewers assigned to them. Uploaded files are validated on the server and served so that
                  they cannot execute.
                </p>
                <p>
                  No system is perfect. If you believe you have found a security problem affecting this site, please
                  write to <a href="mailto:msj@aztu.edu.az">msj@aztu.edu.az</a> and give us a reasonable opportunity to
                  fix it before disclosing it publicly.
                </p>
              </div>
            </div>

            <div className="blk rv">
              <h2 className="blk__h">Changes to this policy</h2>
              <div className="prose">
                <p>
                  We may update this policy as the journal&apos;s practices change. Material changes will be announced
                  on the site. Continuing to use the journal after a change means the revised policy applies.
                </p>
              </div>
            </div>
          </div>

          <aside className="apg__side">
            <div className="scard">
              <div className="scard__h">In short</div>
              <dl>
                <div>
                  <dt>Controller</dt>
                  <dd>Azerbaijan Technical University</dd>
                </div>
                <div>
                  <dt>Reading the journal</dt>
                  <dd>No account, no identification</dd>
                </div>
                <div>
                  <dt>Analytics</dt>
                  <dd>Anonymous view and download counts</dd>
                </div>
                <div>
                  <dt>Advertising trackers</dt>
                  <dd>None</dd>
                </div>
                <div>
                  <dt>Cookies on the public site</dt>
                  <dd>None; one local theme preference</dd>
                </div>
                <div>
                  <dt>Data sold or traded</dt>
                  <dd>Never</dd>
                </div>
                <div>
                  <dt>Requests</dt>
                  <dd>msj@aztu.edu.az</dd>
                </div>
              </dl>
            </div>

            <div className="scard">
              <div className="scard__h">Related</div>
              <ul className="ft__nav">
                <li>
                  <Link href="/terms">Terms &amp; Conditions</Link>
                </li>
                <li>
                  <Link href="/authors/copyright">Copyright Policy</Link>
                </li>
                <li>
                  <Link href="/authors/open-access">Open access policies</Link>
                </li>
                <li>
                  <Link href="/contact">Contact the editorial office</Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
