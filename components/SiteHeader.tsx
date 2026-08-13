"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// Author sign-in / submission live in the portal (admin app); the public site
// only links out to it. Set NEXT_PUBLIC_ADMIN_URL at build to point elsewhere.
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || "http://10.3.43.77:5000";

// The same primary nav as the approved design, now pointing at real routes.
const NAV: { href: string; label: string }[] = [
  { href: "/about", label: "About" },
  { href: "/#current", label: "Current Issue" },
  { href: "/scope", label: "Scope" },
  { href: "/board", label: "Editorial Board" },
  { href: "/archive", label: "Archive" },
  { href: "/authors", label: "For Authors" },
  { href: "/contact", label: "Contact" },
];

/**
 * Global site header — the design's <header class="nav"> reproduced 1:1 with
 * its CSS classes, but the section anchors are now Next <Link> routes. Keeps
 * the working theme toggle (localStorage 'msj-theme' -> data-theme on <html>),
 * the sticky-scroll rule, and the mobile burger. The AZ/EN language toggle is
 * rendered for visual parity but is a no-op for now (the journal is English).
 */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    let cur = root.getAttribute("data-theme");
    if (!cur) cur = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("msj-theme", next); } catch { /* private mode */ }
  }

  return (
    <header className={"nav" + (stuck ? " stuck" : "")} id="nav">
      <div className="wrap nav__in">
        <Link className="brand" href="/">
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="none">
              <g className="rot" stroke="currentColor" strokeWidth="2.5">
                <circle cx="32" cy="32" r="13" /><circle cx="32" cy="32" r="4.5" />
                <g strokeLinecap="round">
                  <path d="M32 19v-7M32 52v-7M45 32h7M12 32h7M41.2 22.8l4.9-4.9M17.9 46.1l4.9-4.9M41.2 41.2l4.9 4.9M17.9 17.9l4.9 4.9" />
                </g>
              </g>
            </svg>
          </span>
          <span className="brand__txt">
            {/* lang="en": the journal's registered name is English. Without this,
                text-transform:uppercase under lang="az" casts i -> İ and the
                masthead misspells itself as MACHİNE. */}
            <span className="brand__name" lang="en">Machine Science</span>
            <span className="brand__sub">AzTU · ISSN 2227-6912</span>
          </span>
        </Link>

        <nav aria-label="Primary">
          <ul className={"nav__links" + (open ? " open" : "")} id="links">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setOpen(false)}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="tools">
          <a className="nav-signin" href={ADMIN_URL}>Sign in</a>
          <div className="lang" role="group" aria-label="Language">
            {/* No-op for now — the journal publishes in English. */}
            <button type="button" aria-pressed={false} lang="az">AZ</button>
            <button type="button" aria-pressed={true} lang="en">EN</button>
          </div>
          <button className="theme" aria-label="Switch colour theme" onClick={toggleTheme}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4.5" />
              <path d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.7 5.3l-1.7 1.7M7 17l-1.7 1.7M18.7 18.7L17 17M7 7L5.3 5.3" />
            </svg>
          </button>
          <button
            className="nav__burger"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
