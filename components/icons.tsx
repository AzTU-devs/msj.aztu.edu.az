/**
 * Shared line-icon set.
 *
 * Every glyph is drawn on the same 24×24 grid at the same 1.8–2.2 stroke and
 * inherits `currentColor`, so a caller only ever sets size + colour in CSS.
 * They were previously re-declared inline in five different pages; keeping one
 * copy is what makes the header, the cards and the article rail look drawn by
 * the same hand.
 */

type P = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconArrow({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeWidth="2.5" {...stroke} aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconArrowUpRight({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeWidth="2.2" {...stroke} aria-hidden="true">
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}

export function IconDownload({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeWidth="2.2" {...stroke} aria-hidden="true">
      <path d="M12 3v13M6 11l6 6 6-6M4 21h16" />
    </svg>
  );
}

export function IconSearch({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeWidth="2" {...stroke} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
    </svg>
  );
}

export function IconClose({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeWidth="2.2" {...stroke} aria-hidden="true">
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

export function IconCheck({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeWidth="2.2" {...stroke} aria-hidden="true">
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

export function IconMail({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeWidth="1.8" {...stroke} aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export function IconPhone({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeWidth="1.8" {...stroke} aria-hidden="true">
      <path d="M6.5 3h3l2 5-2.5 1.5a12 12 0 005.5 5.5L16 12.5l5 2v3a2 2 0 01-2.2 2A17 17 0 013 5.2 2 2 0 015 3z" />
    </svg>
  );
}

export function IconPin({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeWidth="1.8" {...stroke} aria-hidden="true">
      <path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function IconBook({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeWidth="1.7" {...stroke} aria-hidden="true">
      <path d="M4 4.5h6a3 3 0 013 3V20a2.5 2.5 0 00-2.5-2.5H4z" />
      <path d="M20 4.5h-6a3 3 0 00-3 3V20a2.5 2.5 0 012.5-2.5H20z" />
    </svg>
  );
}

export function IconUpload({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeWidth="1.8" {...stroke} aria-hidden="true">
      <path d="M12 20V7M6 12l6-6 6 6M4 21h16" />
    </svg>
  );
}

export function IconArchive({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeWidth="1.7" {...stroke} aria-hidden="true">
      <rect x="3" y="4" width="18" height="4.5" rx="1" />
      <path d="M5 8.5V19a1 1 0 001 1h12a1 1 0 001-1V8.5M10 12.5h4" />
    </svg>
  );
}

export function IconUsers({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeWidth="1.7" {...stroke} aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19.5a5.5 5.5 0 0111 0" />
      <path d="M16 5.4a3.2 3.2 0 010 5.2M17.5 14.4a5.5 5.5 0 013 5.1" />
    </svg>
  );
}

export function IconQuote({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeWidth="1.8" {...stroke} aria-hidden="true">
      <path d="M9 6H4.5v5H9c0 3-1.6 4.6-4 5M20 6h-4.5v5H20c0 3-1.6 4.6-4 5" />
    </svg>
  );
}

export function IconOpenAccess({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeWidth="1.9" {...stroke} aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8.5 10.5V7a3.5 3.5 0 017 0" />
    </svg>
  );
}

export function IconBurger({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeWidth="2" {...stroke} aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export function IconSun({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeWidth="2" {...stroke} aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.7 5.3l-1.7 1.7M7 17l-1.7 1.7M18.7 18.7L17 17M7 7L5.3 5.3" />
    </svg>
  );
}

/**
 * The journal's gear mark — brand lockup, footer masthead and the generated
 * issue covers. The `rot` class is what design.css spins, scoped to
 * `.brand__mark .rot`, so the same glyph is static everywhere else.
 */
export function IconGear({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <g className="rot" stroke="currentColor" strokeWidth="2.5">
        <circle cx="32" cy="32" r="13" />
        <circle cx="32" cy="32" r="4.5" />
        <g strokeLinecap="round">
          <path d="M32 19v-7M32 52v-7M45 32h7M12 32h7M41.2 22.8l4.9-4.9M17.9 46.1l4.9-4.9M41.2 41.2l4.9 4.9M17.9 17.9l4.9 4.9" />
        </g>
      </g>
    </svg>
  );
}

/* ---- solid marks (fill:currentColor) ------------------------------------ */

export function MarkOrcid({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1.6A10.4 10.4 0 1022.4 12 10.4 10.4 0 0012 1.6zm0 1.7A8.7 8.7 0 113.3 12 8.7 8.7 0 0112 3.3z" />
      <rect x="6.4" y="9.1" width="1.7" height="8" />
      <circle cx="7.25" cy="7.1" r="1.1" />
      <path d="M10.3 9.1h3.5c3 0 4.4 2 4.4 4s-1.6 4-4.4 4h-3.5zm1.7 1.6v4.9h1.7c2 0 2.8-1.1 2.8-2.4s-.9-2.4-2.8-2.4z" />
    </svg>
  );
}

export function MarkScopus({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.9 6.6a7.7 7.7 0 00-4.2-1.3c-2.6 0-4.4 1.5-4.4 3.6 0 1.9 1.3 3 3.7 3.8l1.4.5c1.7.6 2.4 1.2 2.4 2.2 0 1.2-1.1 2-2.8 2a6.6 6.6 0 01-3.9-1.4l-.9 1.5a8.2 8.2 0 004.8 1.6c2.9 0 4.9-1.6 4.9-3.9 0-2-1.2-3.1-3.8-4l-1.4-.5c-1.6-.5-2.3-1.1-2.3-2.1 0-1.1 1-1.8 2.5-1.8a6 6 0 013.2 1z" />
    </svg>
  );
}

export function MarkMail({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.5 5h17A1.5 1.5 0 0122 6.5v11a1.5 1.5 0 01-1.5 1.5H19V9.4l-7 5-7-5V19H3.5A1.5 1.5 0 012 17.5v-11A1.5 1.5 0 013.5 5zm.9 1.8L12 12.2l7.6-5.4z" />
    </svg>
  );
}

/** Social marks, keyed by the slug the backend stores in settings.social. */
export const SOCIAL_MARKS: Record<string, (p: P) => React.ReactElement> = {
  facebook: ({ className }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6A22 22 0 0014.3 3.5c-2.4 0-4 1.45-4 4.1v2.3H7.6V13h2.7v8z" />
    </svg>
  ),
  x: ({ className }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 3h3l-6.6 7.5L21.7 21h-6l-4.7-6.1L5.6 21h-3l7-8-6.9-10h6.1l4.3 5.6zm-1 16h1.7L7.6 4.8H5.8z" />
    </svg>
  ),
  twitter: ({ className }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 3h3l-6.6 7.5L21.7 21h-6l-4.7-6.1L5.6 21h-3l7-8-6.9-10h6.1l4.3 5.6zm-1 16h1.7L7.6 4.8H5.8z" />
    </svg>
  ),
  linkedin: ({ className }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.8 3.5a2 2 0 110 4 2 2 0 010-4zM3.1 9.1h3.4V21H3.1zM9.3 9.1h3.25v1.6h.05a3.6 3.6 0 013.2-1.75c3.4 0 4.05 2.25 4.05 5.15V21h-3.4v-5.25c0-1.25 0-2.85-1.75-2.85s-2 1.35-2 2.75V21H9.3z" />
    </svg>
  ),
  instagram: ({ className }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 4.6c2.4 0 2.7 0 3.6.05 2.45.1 3.6 1.25 3.7 3.7.05.9.05 1.2.05 3.6s0 2.7-.05 3.6c-.1 2.45-1.25 3.6-3.7 3.7-.9.05-1.2.05-3.6.05s-2.7 0-3.6-.05c-2.45-.1-3.6-1.25-3.7-3.7C4.65 14.7 4.65 14.4 4.65 12s0-2.7.05-3.6c.1-2.45 1.25-3.6 3.7-3.7.9-.05 1.2-.05 3.6-.05zM12 2.9c-2.45 0-2.75.01-3.7.06C5 3.11 3.11 5 2.96 8.3c-.05.95-.06 1.25-.06 3.7s.01 2.75.06 3.7c.15 3.3 2.04 5.19 5.34 5.34.95.05 1.25.06 3.7.06s2.75-.01 3.7-.06c3.3-.15 5.19-2.04 5.34-5.34.05-.95.06-1.25.06-3.7s-.01-2.75-.06-3.7C20.89 5 19 3.11 15.7 2.96c-.95-.05-1.25-.06-3.7-.06zm0 4.4a4.7 4.7 0 104.7 4.7A4.7 4.7 0 0012 7.3zm0 7.75A3.05 3.05 0 1115.05 12 3.05 3.05 0 0112 15.05zm4.9-8a1.1 1.1 0 101.1 1.1 1.1 1.1 0 00-1.1-1.1z" />
    </svg>
  ),
  youtube: ({ className }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2a2.5 2.5 0 00-1.75-1.8C18.3 5 12 5 12 5s-6.3 0-7.85.4A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.75 1.8C5.7 19 12 19 12 19s6.3 0 7.85-.4a2.5 2.5 0 001.75-1.8A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3z" />
    </svg>
  ),
  telegram: ({ className }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.8 4.3L18.7 19c-.23 1.03-.85 1.28-1.72.8l-4.75-3.5-2.29 2.2c-.25.26-.47.47-.96.47l.34-4.84 8.8-7.95c.38-.34-.09-.53-.6-.19L6.65 13.1 1.96 11.6c-1.02-.32-1.04-1.02.21-1.51l18.3-7.06c.85-.31 1.6.19 1.33 1.27z" />
    </svg>
  ),
  researchgate: ({ className }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.3 6.2c-1.9 0-3.1 1.2-3.1 3.1v2c0 1.9 1.2 3.1 3.1 3.1 1.85 0 3-1.15 3-3v-1.1H9.65v1.15h1.4v.15c0 1.05-.6 1.65-1.7 1.65-1.15 0-1.8-.7-1.8-1.95v-2c0-1.25.65-1.95 1.8-1.95.95 0 1.5.45 1.7 1.3l1.25-.3c-.3-1.35-1.3-2.15-2.95-2.15zM15.4 9.3c-1.55 0-2.6 1-2.6 2.5s1.05 2.5 2.6 2.5c1.5 0 2.55-1 2.55-2.5s-1.05-2.5-2.55-2.5zm0 1.15c.8 0 1.3.5 1.3 1.35s-.5 1.35-1.3 1.35-1.35-.5-1.35-1.35.55-1.35 1.35-1.35z" />
    </svg>
  ),
};
