import type { Metadata } from "next";
import type { ReactNode } from "react";
import { api, text, type Home } from "@/lib/api";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import Reveal from "@/components/Reveal";

// Line-drawn scope icons, keyed exactly as the backend delivers them
// (gear|wave|chip|layer|leaf|trend|tool). Rendered as JSX so the file stays
// free of dangerouslySetInnerHTML; `currentColor` picks up the accent tint via
// .scope__ic in design.css. Unknown keys fall back to `gear`.
const ICONS: Record<string, ReactNode> = {
  gear: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.4" />
      <path strokeLinecap="round" d="M12 8V5m0 14v-3m4-4h3M5 12h3m1.2-2.8L7 7m10 10l-2.2-2.2M14.8 9.2L17 7M7 17l2.2-2.2" />
    </svg>
  ),
  wave: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M2 16c2.5 0 2.5-8 5-8s2.5 8 5 8 2.5-8 5-8 2.5 8 5 8" />
    </svg>
  ),
  chip: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path strokeLinecap="round" d="M10 7V4m4 3V4m-4 16v-3m4 3v-3M7 10H4m3 4H4m16-4h-3m3 4h-3" />
    </svg>
  ),
  layer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" />
      <path d="M3 12.5L12 17l9-4.5M3 16.8L12 21.3l9-4.5" />
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M20 4C10 4 4 9 4 16a6 6 0 006 4c8 0 10-8 10-16z" />
      <path d="M4 20c4-8 8-11 13-13" />
    </svg>
  ),
  trend: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l5.5-5.5 4 4L21 7" />
      <path d="M15 7h6v6" />
    </svg>
  ),
  tool: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3a5 5 0 00-4.6 7l-7 7 2.6 2.6 7-7A5 5 0 1015 3z" />
    </svg>
  ),
};

const LEDE =
  'Authors are cordially invited to submit articles to “Machine Science” on the following topics.';

export const metadata: Metadata = {
  title: "Scope",
  description:
    "Subject areas covered by Machine Science — the engineering and machine-science topics on which the journal invites original research.",
  alternates: { canonical: "/scope" },
  openGraph: {
    title: "Scope · Machine Science",
    description:
      "Subject areas covered by Machine Science — the topics on which the journal invites original research.",
    url: "/scope",
    type: "website",
  },
};

async function load(): Promise<Home | null> {
  try {
    return await api.home();
  } catch {
    return null;
  }
}

export default async function ScopePage() {
  const home = await load();
  const topics = home?.scopeTopics ?? [];
  const t = (key: string, fallback: string) =>
    text(home?.texts?.[key], "en") || fallback;

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Scope", url: "/scope" },
        ])}
      />
      <Reveal />

      <section className="sec" id="scope">
        <div className="wrap">
          <div className="sec__head rv">
            <p className="annot">{t("scope.label", "Scope")}</p>
            <h2 className="sec__title">{t("scope.title", "Where we publish")}</h2>
            <p className="sec__lede">{t("scope.lede", LEDE)}</p>
          </div>

          <div className="scope rv">
            {topics.map((topic, i) => (
              <div className="scope__c" key={topic.id ?? i}>
                <span className="scope__ic" aria-hidden="true">
                  {ICONS[topic.icon] ?? ICONS.gear}
                </span>
                <div className="scope__n">{text(topic.title, "en")}</div>
                <p className="scope__d">{text(topic.description, "en")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
