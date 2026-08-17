"use client";
import { useState } from "react";
import type { CiteFormats } from "@/lib/cite";

const TABS: { key: keyof CiteFormats; label: string }[] = [
  { key: "plain", label: "Citation" },
  { key: "bibtex", label: "BibTeX" },
  { key: "ris", label: "RIS" },
];

/**
 * "How to cite" — the block every reader who arrives from Scholar goes looking
 * for. The three strings are formatted on the server (lib/cite.ts) from the
 * same record as the citation_* meta tags; this island only switches between
 * them and copies to the clipboard.
 */
export default function CiteCard({ formats }: { formats: CiteFormats }) {
  const [tab, setTab] = useState<keyof CiteFormats>("plain");
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(formats[tab]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the text is selectable in the panel anyway */
    }
  }

  return (
    <div className="scard">
      <div className="scard__h">How to cite</div>

      <div className="cite__tabs" role="tablist" aria-label="Citation format">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            className="cite__tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <pre className="cite__out" tabIndex={0}>
        {formats[tab]}
      </pre>

      <button className="cite__copy" type="button" onClick={copy}>
        {copied ? "Copied" : "Copy to clipboard"}
      </button>
    </div>
  );
}
