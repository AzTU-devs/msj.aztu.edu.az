import Link from "next/link";
import { api, text, type Home } from "@/lib/api";
import {
  FOUNDED,
  ISSN_ONLINE,
  ISSN_PRINT,
  JOURNAL_NAME,
  PUBLISHER,
  PUBLISHER_URL,
} from "@/lib/journal";
import { IconCheck, IconGear, IconMail, IconPhone, IconPin, SOCIAL_MARKS } from "@/components/icons";
import { ADMIN_URL } from "@/lib/site";

const FALLBACK_EMAIL = "msj@aztu.edu.az";
const FALLBACK_PHONE = "(+994 12) 539-12-25";
const FALLBACK_ADDRESS = "H. Javid ave 25, Baku AZ 1073, Azerbaijan";

const TAGLINE =
  "An international scientific and technical journal on the theory of mechanisms and machines, published continuously by Azerbaijan Technical University since 2001.";

/** Degrade to the printed values if the backend is unreachable — the footer is
 *  in the root layout and must never be the thing that fails a page. */
async function load(): Promise<Home | null> {
  try {
    return await api.home();
  } catch {
    return null;
  }
}

function telHref(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
}

/**
 * Global site footer.
 *
 * Was a single line of small print. A journal's footer is a directory — it is
 * where readers, librarians and indexing services look for the ISSNs, the
 * publisher of record, the policies and the editorial address — so it is now
 * four columns plus a rule of legal small print.
 */
export default async function SiteFooter() {
  const home = await load();
  const s = home?.settings;

  const email = s?.email || FALLBACK_EMAIL;
  const phone = s?.phone || FALLBACK_PHONE;
  const address = text(s?.address, "en") || FALLBACK_ADDRESS;
  const tagline = text(s?.tagline, "en") || TAGLINE;
  const issnPrint = s?.issnPrint || ISSN_PRINT;
  const issnOnline = s?.issnOnline || ISSN_ONLINE;
  const publisher = s?.publisher || PUBLISHER;
  const indexedIn = (s?.indexedIn ?? []).slice(0, 6);

  const social = Object.entries(s?.social ?? {})
    .map(([k, v]) => [k.toLowerCase(), v] as const)
    .filter(([k, v]) => Boolean(v) && k in SOCIAL_MARKS);

  const thisYear = new Date().getFullYear();

  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft__grid">
          {/* ---- masthead ---- */}
          <div className="ft__brand">
            <Link className="ft__mark" href="/">
              <span aria-hidden="true">
                <IconGear />
              </span>
              <span className="ft__nm" lang="en">
                {JOURNAL_NAME}
              </span>
            </Link>

            <p className="ft__about">{tagline}</p>

            <div className="ft__issn">
              <span>
                ISSN (print) <b>{issnPrint}</b>
              </span>
              <span>
                E-ISSN (online) <b>{issnOnline}</b>
              </span>
              {s?.doiPrefix && (
                <span>
                  DOI prefix <b>{s.doiPrefix}</b>
                </span>
              )}
            </div>

            {social.length > 0 && (
              <div className="ft__soc">
                {social.map(([key, url]) => {
                  const Mark = SOCIAL_MARKS[key];
                  return (
                    <a key={key} href={url} target="_blank" rel="noopener" aria-label={key} title={key}>
                      <Mark />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* ---- the journal ---- */}
          <div>
            <h2 className="ft__h">The journal</h2>
            <ul className="ft__nav">
              <li>
                <Link href="/about">About Machine Science</Link>
              </li>
              <li>
                <Link href="/scope">Aim &amp; scope</Link>
              </li>
              <li>
                <Link href="/board">Editorial board</Link>
              </li>
              <li>
                <Link href="/#current">Current issue</Link>
              </li>
              <li>
                <Link href="/archive">Archive</Link>
              </li>
              <li>
                <Link href="/search">Search articles</Link>
              </li>
            </ul>
          </div>

          {/* ---- for authors ---- */}
          <div>
            <h2 className="ft__h">For authors</h2>
            <ul className="ft__nav">
              <li>
                <a href={ADMIN_URL}>Submit a manuscript</a>
              </li>
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
              <li>
                <Link href="/board">Peer review</Link>
              </li>
            </ul>
          </div>

          {/* ---- editorial office ---- */}
          <div>
            <h2 className="ft__h">Editorial office</h2>
            <div className="ft__ct">
              <span>
                <IconPin />
                {address}
              </span>
              <a href={`mailto:${email}`}>
                <IconMail />
                {email}
              </a>
              <a href={`tel:${telHref(phone)}`}>
                <IconPhone />
                {phone}
              </a>
            </div>

            {indexedIn.length > 0 && (
              <>
                <h2 className="ft__h" style={{ marginTop: "1.6rem" }}>
                  Indexed in
                </h2>
                <div className="badges">
                  {indexedIn.map((name) => (
                    <span className="badge" key={name}>
                      <IconCheck />
                      {name}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="ft__bar">
        <div className="wrap ft__in">
          <div className="ft__c">
            © {FOUNDED}–{thisYear} <b>{JOURNAL_NAME}</b> · Published by{" "}
            <a href={PUBLISHER_URL} target="_blank" rel="noopener">
              {publisher}
            </a>
          </div>

          <div className="ft__l">
            <a
              className="ft__cc"
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener license"
            >
              CC BY 4.0
            </a>
            <Link href="/about">Ethics</Link>
            <Link href="/contact">Contact</Link>
            <a href="/sitemap.xml">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
