import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { api, text, type Home } from "@/lib/api";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import Reveal from "@/components/Reveal";

// Author sign-in / submission live in the portal (admin app); the public site
// only links out to it. Matches the homepage design's "Submit a manuscript" CTA.
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || "http://10.3.43.77:5000";

export const metadata: Metadata = {
  title: "For Authors",
  description:
    "How to publish in Machine Science — the manuscript-to-publication process, submission terms and open-access policy. Submission is free of charge and peer-reviewed.",
  alternates: { canonical: "/authors" },
  openGraph: {
    type: "website",
    title: "For Authors · Machine Science",
    description:
      "The manuscript-to-publication process and submission terms for Machine Science — free of charge, peer-reviewed, open access.",
    url: "/authors",
  },
};

// Fetch the same aggregate feed the homepage uses; degrade to empty lists if the
// backend is unreachable so the page (and its CTA) still ships. Mirrors the
// scope / board page pattern.
async function load(): Promise<Home | null> {
  try {
    return await api.home();
  } catch {
    return null;
  }
}

// The check mark the approved design ships for each submission term (IC.check).
const CheckMark = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);

// The forward arrow used on the design's fill buttons (hero.cta1).
const ArrowMark = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

// The section title in the design is a two-line heading ("From manuscript<br>to
// publication"). The backend text may carry a literal <br>; render it as real
// line breaks rather than JSX-escaped markup, and fall back cleanly otherwise.
function MultiLine({ value }: { value: string }): ReactNode {
  const parts = value.split(/<br\s*\/?>/i);
  return parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </Fragment>
  ));
}

export default async function AuthorsPage() {
  const home = await load();
  const steps = home?.authorSteps ?? [];
  const terms = home?.authorTerms ?? [];
  const t = (key: string, fallback: string) =>
    text(home?.texts?.[key], "en") || fallback;

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "For Authors", url: "/authors" },
        ])}
      />

      <section className="sec" id="authors">
        <div className="wrap">
          <div className="sec__head rv">
            <p className="annot">{t("authors.label", "For authors")}</p>
            <h1 className="sec__title">
              <MultiLine value={t("authors.title", "From manuscript<br>to publication")} />
            </h1>
            <p className="hero__cta" style={{ marginTop: "1.6rem" }}>
              <a className="btn btn--fill" href={ADMIN_URL}>
                <span>Submit a manuscript</span>
                {ArrowMark}
              </a>
            </p>
          </div>

          <div className="auth">
            <div className="rv">
              {steps.map((step, i) => (
                <div className="step" key={step.stepNo ?? i}>
                  <div className="step__n">{step.stepNo}</div>
                  <div>
                    <div className="step__t">{text(step.title, "en")}</div>
                    <p className="step__d">{text(step.body, "en")}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="terms rv">
              {terms.map((term, i) => (
                <div className="term" key={i}>
                  <span className="term__ic" aria-hidden="true">
                    {CheckMark}
                  </span>
                  <div>
                    <div className="term__t">{text(term.title, "en")}</div>
                    <p className="term__d">{text(term.body, "en")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Reveal />
    </main>
  );
}
