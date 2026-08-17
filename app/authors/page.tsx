import type { Metadata } from "next";
import Link from "next/link";
import { api, text, type Home } from "@/lib/api";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import { IconArrow, IconCheck, IconOpenAccess, IconQuote, IconUpload } from "@/components/icons";
// Author sign-in / submission live in the portal (admin-msj.aztu.edu.az); the
// public site only links out to it.
import { ADMIN_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Information for Authors",
  description:
    "How to publish in Machine Science — manuscript preparation, the open access policies and the AI policy, plus the manuscript-to-publication process. Submission is free of charge and peer-reviewed.",
  alternates: { canonical: "/authors" },
  openGraph: {
    type: "website",
    title: "Information for Authors · Machine Science",
    description:
      "Manuscript preparation, open access policies, AI policy and the submission process for Machine Science — free of charge, peer-reviewed, open access.",
    url: "/authors",
  },
};

// The three guidance pages this section is the hub for. Kept here as well as in
// the header dropdown so the section is navigable from the page itself.
const GUIDES = [
  {
    href: "/authors/manuscript",
    title: "Preparation of Manuscript",
    body: "Subject areas, accepted types of work, page format and the full submission checklist.",
  },
  {
    href: "/authors/open-access",
    title: "Open access policies",
    body: "Gold Open Access, Creative Commons licensing, the repository embargo and preprints.",
  },
  {
    href: "/authors/ai-policy",
    title: "AI Policy",
    body: "What authors, editors and reviewers may do with generative AI — and how to disclose it.",
  },
];

// Fetch the same aggregate feed the homepage uses; degrade to empty lists if the
// backend is unreachable so the page (and its CTA) still ships.
async function load(): Promise<Home | null> {
  try {
    return await api.home();
  } catch {
    return null;
  }
}

export default async function AuthorsPage() {
  const home = await load();
  const steps = home?.authorSteps ?? [];
  const terms = home?.authorTerms ?? [];
  const t = (key: string, fallback: string) => text(home?.texts?.[key], "en") || fallback;

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Information for Authors", url: "/authors" },
        ])}
      />
      <Reveal />
      <noscript>
        <style>{`.rv{opacity:1 !important;transform:none !important;}`}</style>
      </noscript>

      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Information for Authors" }]}
        eyebrow={t("authors.label", "Information for authors")}
        titleHtml={t("authors.title", "From manuscript<br>to publication")}
        lede="Machine Science makes no charge to authors at any stage — no submission fee, no review fee, no article-processing charge. Every accepted paper is published open access under CC BY 4.0 and the author keeps the copyright."
        meta={
          <>
            <span>
              Review <b>Double-blind</b>
            </span>
            <span>
              Charges <b>None</b>
            </span>
            <span>
              Licence <b>CC BY 4.0</b>
            </span>
            <span>
              Language <b>English</b>
            </span>
          </>
        }
        actions={
          <>
            <a className="btn btn--fill" href={ADMIN_URL}>
              <span>Submit a manuscript</span>
              <IconUpload />
            </a>
            <Link className="btn btn--line" href="/scope">
              <span>Check the scope first</span>
              <IconArrow />
            </Link>
          </>
        }
      />

      {/* The three guidance pages, before the process — most people arriving
          here want a specific policy, not the workflow narrative. */}
      <section className="sec sec--tight">
        <div className="wrap">
          <div className="quick rv">
            {GUIDES.map((g, i) => (
              <Link className="qcard" href={g.href} key={g.href}>
                <span className="qcard__ic" aria-hidden="true">
                  {i === 0 ? <IconQuote /> : i === 1 ? <IconOpenAccess /> : <IconCheck />}
                </span>
                <span className="qcard__t">
                  {g.title} <IconArrow />
                </span>
                <p className="qcard__d">{g.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="authors">
        <div className="wrap">
          {steps.length === 0 && terms.length === 0 ? (
            <div className="empty rv">
              <p className="empty__t">Author guidance is being updated</p>
              <p className="empty__d">
                Manuscripts are accepted through the submission portal. Write to the editorial office if you need the
                current template before this page returns.
              </p>
            </div>
          ) : (
            <div className="auth">
              {steps.length > 0 && (
                <div className="rv">
                  <h2 className="blk__h">The process</h2>
                  {steps.map((step, i) => (
                    <div className="step" key={step.stepNo ?? i}>
                      <div className="step__n">{String(step.stepNo ?? i + 1).padStart(2, "0")}</div>
                      <div>
                        <div className="step__t">{text(step.title, "en")}</div>
                        <p className="step__d">{text(step.body, "en")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {terms.length > 0 && (
                <div className="rv">
                  <h2 className="blk__h">Terms of submission</h2>
                  <div className="terms">
                    {terms.map((term, i) => (
                      <div className="term" key={i}>
                        <span className="term__ic" aria-hidden="true">
                          <IconCheck />
                        </span>
                        <div>
                          <div className="term__t">{text(term.title, "en")}</div>
                          <p className="term__d">{text(term.body, "en")}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hero__cta" style={{ marginTop: "1.8rem" }}>
                    <a className="btn btn--fill" href={ADMIN_URL}>
                      <span>Start a submission</span>
                      <IconArrow />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
