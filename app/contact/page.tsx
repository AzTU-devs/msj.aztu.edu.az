import type { Metadata } from "next";
import { api, text, type Home } from "@/lib/api";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import Reveal from "@/components/Reveal";

// Fallbacks mirror the approved design's hard-coded contact values so the page
// is never blank if the backend is unreachable or a setting is unset.
const FALLBACK_EMAIL = "msj@aztu.edu.az";
const FALLBACK_PHONE = "(+994 12) 539-12-25";
const FALLBACK_ADDRESS = "H. Javid ave 25, Baku AZ 1073";
const PUBLISHER = "Azerbaijan Technical University";
const PUBLISHER_URL = "https://aztu.edu.az";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the editorial office of Machine Science at Azerbaijan Technical University — e-mail, telephone and postal address for editorial and open-access enquiries.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    title: "Contact · Machine Science",
    description:
      "Reach the editorial office of Machine Science at Azerbaijan Technical University by e-mail, telephone or post.",
    url: "/contact",
  },
};

// ISR fetch that degrades to null so a backend outage never breaks the build —
// the same pattern the other section pages use.
async function load(): Promise<Home | null> {
  try {
    return await api.home();
  } catch {
    return null;
  }
}

/** Build a `tel:` href from a display phone number (keep digits and leading +). */
function telHref(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
}

export default async function ContactPage() {
  const home = await load();
  const s = home?.settings;

  const email = s?.email || FALLBACK_EMAIL;
  const phone = s?.phone || FALLBACK_PHONE;
  const address = text(s?.address, "en") || FALLBACK_ADDRESS;

  const t = (key: string, fallback: string) =>
    text(home?.texts?.[key], "en") || fallback;

  // The design's contact.title carries markup (a <br>) — mirror data-i18n-html.
  const titleHtml =
    text(home?.texts?.["contact.title"], "en") || "Send us<br>your research";

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: PUBLISHER,
    url: PUBLISHER_URL,
    email,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: "Baku",
      addressCountry: "AZ",
    },
  };

  return (
    <main>
      {/* Without JS the .rv elements stay at opacity:0 — reveal them so the page
          is never blank for no-JS clients and crawlers. */}
      <noscript>
        <style>{`.rv{opacity:1 !important;transform:none !important;}`}</style>
      </noscript>

      <JsonLd
        data={[
          orgJsonLd,
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Contact", url: "/contact" },
          ]),
        ]}
      />

      <section className="cta" id="contact">
        <div className="wrap cta__in">
          <div className="rv">
            <p className="annot">{t("contact.label", "Contact")}</p>
            <h1
              className="cta__t"
              dangerouslySetInnerHTML={{ __html: titleHtml }}
            />
            <p className="cta__d">
              {t(
                "contact.lede",
                "Editorial office of “Machine Science”, Azerbaijan Technical University. Open access questions not answered by our policy are welcome by e-mail."
              )}
            </p>
            <a className="btn btn--fill" href={`mailto:${email}`}>
              <span>{t("contact.cta", "Write to the editors")}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>

          <div className="cards rv">
            <a className="card" href={`mailto:${email}`}>
              <span className="card__ic" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2.5" y="5" width="19" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </span>
              <span>
                <span className="card__k">{t("card.email", "E-mail")}</span>
                <span className="card__v">{email}</span>
              </span>
            </a>

            <a className="card" href={`tel:${telHref(phone)}`}>
              <span className="card__ic" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6.5 3h3l2 5-2.5 1.5a12 12 0 005.5 5.5L16 12.5l5 2v3a2 2 0 01-2.2 2A17 17 0 013 5.2 2 2 0 015 3z" />
                </svg>
              </span>
              <span>
                <span className="card__k">{t("card.phone", "Telephone")}</span>
                <span className="card__v">{phone}</span>
              </span>
            </a>

            <a
              className="card"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${PUBLISHER}, ${address}`
              )}`}
              target="_blank"
              rel="noopener"
            >
              <span className="card__ic" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <span>
                <span className="card__k">{t("card.office", "Editorial office")}</span>
                <span className="card__v">{address}</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      <Reveal />
    </main>
  );
}
