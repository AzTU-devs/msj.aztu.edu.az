import type { Metadata } from "next";
import { api, text, type Home } from "@/lib/api";
import { JsonLd, breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import { scopeIcon } from "@/components/scopeIcons";
import { IconArrow } from "@/components/icons";
import { ADMIN_URL } from "@/lib/site";

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
  const t = (key: string, fallback: string) => text(home?.texts?.[key], "en") || fallback;

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Scope", url: "/scope" },
          ]),
          collectionJsonLd({
            name: "Machine Science — Aim & scope",
            url: "/scope",
            description:
              "Subject areas covered by Machine Science — the topics on which the journal invites original research.",
          }),
        ]}
      />
      <Reveal />

      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Scope" }]}
        eyebrow={t("scope.label", "Scope")}
        title={t("scope.title", "Where we publish")}
        lede={t("scope.lede", LEDE)}
        meta={
          topics.length > 0 ? (
            <span>
              <b>{topics.length}</b> subject areas
            </span>
          ) : undefined
        }
        actions={
          <a className="btn btn--fill" href={ADMIN_URL}>
            <span>Submit a manuscript</span>
            <IconArrow />
          </a>
        }
      />

      <section className="sec" id="scope">
        <div className="wrap">
          {topics.length === 0 ? (
            <div className="empty rv">
              <p className="empty__t">The subject list is being updated</p>
              <p className="empty__d">
                Machine Science publishes across the theory of mechanisms and machines, mechanical engineering
                technology, mechatronics, materials and energy. Write to the editors if your topic is not listed.
              </p>
            </div>
          ) : (
            <div className="scope rv">
              {topics.map((topic, i) => (
                <div className="scope__c" key={topic.id ?? i}>
                  <span className="scope__ic" aria-hidden="true">
                    {scopeIcon(topic.icon)}
                  </span>
                  <div className="scope__n">{text(topic.title, "en")}</div>
                  <p className="scope__d">{text(topic.description, "en")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
