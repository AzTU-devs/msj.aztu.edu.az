"use client";
import { useState } from "react";
import { IconCheck, IconMail, SOCIAL_MARKS } from "@/components/icons";

const XMark = SOCIAL_MARKS.x;
const LinkedInMark = SOCIAL_MARKS.linkedin;

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
      <path d="M10 13.5a4 4 0 006 .5l2.5-2.5a4 4 0 10-5.7-5.7L11.5 7" />
      <path d="M14 10.5a4 4 0 00-6-.5L5.5 12.5a4 4 0 105.7 5.7L12.5 17" />
    </svg>
  );
}

/**
 * Share rail for an article. Deliberately small: a copy-link button (what
 * researchers actually use), e-mail, and the two networks where engineering
 * papers get passed around. No trackers, no third-party scripts — every target
 * is a plain link.
 */
export default function ShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const enc = encodeURIComponent;

  return (
    <div className="share">
      <button type="button" onClick={copyLink} aria-label="Copy link to this article" title={copied ? "Copied" : "Copy link"}>
        {copied ? <IconCheck /> : <LinkIcon />}
      </button>

      <a
        href={`mailto:?subject=${enc(title)}&body=${enc(url)}`}
        aria-label="Share by e-mail"
        title="Share by e-mail"
      >
        <IconMail />
      </a>

      <a
        href={`https://x.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`}
        target="_blank"
        rel="noopener"
        aria-label="Share on X"
        title="Share on X"
      >
        <XMark />
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`}
        target="_blank"
        rel="noopener"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <LinkedInMark />
      </a>
    </div>
  );
}
