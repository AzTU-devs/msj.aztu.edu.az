import type { Metadata } from "next";
import { api, text, type Home } from "@/lib/api";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { PUBLISHER, PUBLISHER_URL } from "@/lib/journal";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import { IconArrow, IconMail, IconPhone, IconPin } from "@/components/icons";

// Fallbacks mirror the approved design's hard-coded contact values so the page
// is never blank if the backend is unreachable or a setting is unset.
const FALLBACK_EMAIL = "msj@aztu.edu.az";
const FALLBACK_PHONE = "(+994 12) 539-12-25";
const FALLBACK_ADDRESS = "H. Javid ave 25, Baku AZ 1073";

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

  const t = (key: string, fallback: string) => text(home?.texts?.[key], "en") || fallback;

  // The design's contact.title carries markup (a <br>) — mirror data-i18n-html.
  const titleHtml = t("contact.title", "Send us<br>your research");

  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${PUBLISHER}, ${address}`
  )}`;

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

      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Contact" }]}
        eyebrow={t("contact.label", "Contact")}
        titleHtml={titleHtml}
        lede={t(
          "contact.lede",
          "Editorial office of “Machine Science”, Azerbaijan Technical University. Open access questions not answered by our policy are welcome by e-mail."
        )}
        meta={
          <>
            <span>
              Office hours <b>Mon–Fri, 09:00–17:00 (UTC+4)</b>
            </span>
            <span>
              Reply within <b>five working days</b>
            </span>
          </>
        }
        actions={
          <a className="btn btn--fill" href={`mailto:${email}`}>
            <span>{t("contact.cta", "Write to the editors")}</span>
            <IconArrow />
          </a>
        }
      />

      <section className="sec" id="contact">
        <div className="wrap cta__in">
          <div className="rv">
            <h2 className="blk__h">Editorial office</h2>
            <p className="prose">
              Manuscripts are <b>not</b> accepted by e-mail — please use the submission portal so your paper enters
              the review workflow with a tracking number. Everything else (editorial queries, indexing, permissions,
              corrections) reaches the editors at the address opposite.
            </p>

            <p className="prose" style={{ marginTop: "1.2rem" }}>
              Published by{" "}
              <a href={PUBLISHER_URL} target="_blank" rel="noopener">
                {PUBLISHER}
              </a>
              , Baku, Azerbaijan.
            </p>
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

            <a className="card" href={`tel:${telHref(phone)}`}>
              <span className="card__ic" aria-hidden="true">
                <IconPhone />
              </span>
              <span>
                <span className="card__k">{t("card.phone", "Telephone")}</span>
                <span className="card__v">{phone}</span>
              </span>
            </a>

            <a className="card" href={mapHref} target="_blank" rel="noopener">
              <span className="card__ic" aria-hidden="true">
                <IconPin />
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
