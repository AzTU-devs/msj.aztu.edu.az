"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  IconBurger,
  IconChevron,
  IconClose,
  IconGear,
  IconOpenAccess,
  IconSearch,
  IconSun,
} from "@/components/icons";
// Author sign-in / submission live in the portal (admin-msj.aztu.edu.az); the
// public site only links out to it. See lib/site.ts for the three hosts.
import { ADMIN_URL } from "@/lib/site";

interface NavItem {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

const NAV: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/#current", label: "Current Issue" },
  { href: "/scope", label: "Scope" },
  { href: "/board", label: "Editorial Board" },
  { href: "/archive", label: "Archive" },
  {
    href: "/authors",
    label: "Information for Authors",
    children: [
      { href: "/authors/manuscript", label: "Preparation of Manuscript" },
      { href: "/authors/open-access", label: "Open access policies" },
      { href: "/authors/ai-policy", label: "AI Policy" },
    ],
  },
  { href: "/contact", label: "Contact" },
];

/**
 * Global site header — two strips.
 *
 * The upper utility bar carries the facts a scholarly reader checks before
 * reading a word (both ISSNs, open access, peer review) plus the portal
 * sign-in; it scrolls away. The lower bar is the sticky one: brand, primary
 * nav, search, language, theme and the single filled "Submit" call to action.
 *
 * "Information for Authors" is a dropdown. It opens on hover *and* on
 * focus-within, both in CSS, so it needs no client state and works for keyboard
 * users; in the mobile drawer the sub-items are simply rendered inline. The
 * parent label is itself a link to the /authors overview, so the menu is never
 * a dead end on touch.
 *
 * Search is a plain GET form pointed at /search, so it degrades to a normal
 * page navigation. The AZ/EN toggle is rendered for parity but is a no-op —
 * the journal publishes in English.
 */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [searching, setSearching] = useState(false);
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Any navigation closes both the drawer and the search panel.
  useEffect(() => {
    setOpen(false);
    setSearching(false);
  }, [pathname]);

  // Search panel: focus the field, trap scrolling, close on Escape.
  useEffect(() => {
    if (!searching) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearching(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [searching]);

  function toggleTheme() {
    const root = document.documentElement;
    // The site ships white and no longer follows prefers-color-scheme, so an
    // unset attribute means light. Reading the OS preference here (as this
    // used to) made the first click a no-op on a system set to dark: it
    // computed "dark", switched to "light", and nothing visibly changed.
    const cur = root.getAttribute("data-theme") || "light";
    const next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("msj-theme", next);
    } catch {
      /* private mode */
    }
  }

  /** A route is current when it is the page itself or one of its children. */
  function isCurrent(href: string): boolean {
    if (href.includes("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* ---------- utility strip ---------- */}
      <div className="ubar">
        <div className="wrap ubar__in">
          <div className="ubar__facts">
            <span className="ubar__f">
              ISSN <b>2227-6912</b>
            </span>
            <span className="ubar__f">
              E-ISSN <b>2790-0479</b>
            </span>
            <span className="ubar__dot" aria-hidden="true" />
            <span className="ubar__f ubar__f--oa">
              <b>Open access</b>
            </span>
            <span className="ubar__f">Peer reviewed</span>
            <span className="ubar__f">
              Free of <b>charge</b>
            </span>
          </div>

          <div className="ubar__links">
            <a href="https://aztu.edu.az" target="_blank" rel="noopener">
              Azerbaijan Technical University
            </a>
            <Link href="/authors/open-access">Open access policy</Link>
            <a className="ubar__signin" href={ADMIN_URL}>
              Author sign-in
            </a>
          </div>
        </div>
      </div>

      {/* ---------- sticky bar ---------- */}
      <header className={"nav" + (stuck ? " stuck" : "")} id="nav">
        <div className="wrap nav__in">
          <Link className="brand" href="/">
            <span className="brand__mark" aria-hidden="true">
              <IconGear />
            </span>
            <span className="brand__txt">
              {/* lang="en": the journal's registered name is English. Without this,
                  text-transform:uppercase under lang="az" casts i -> İ and the
                  masthead misspells itself as MACHİNE. */}
              <span className="brand__name" lang="en">
                Machine Science
              </span>
              <span className="brand__sub">AzTU · Est. 2001</span>
            </span>
          </Link>

          <nav aria-label="Primary">
            <ul className={"nav__links" + (open ? " open" : "")} id="links">
              {NAV.map((n) => (
                <li key={n.href} className={n.children ? "has-sub" : undefined}>
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    {...(isCurrent(n.href) ? { "aria-current": "page" as const } : {})}
                  >
                    {n.label}
                    {n.children && <IconChevron className="nav__chev" />}
                  </Link>

                  {n.children && (
                    <ul className="nav__sub">
                      {n.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            onClick={() => setOpen(false)}
                            {...(isCurrent(c.href) ? { "aria-current": "page" as const } : {})}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}

              {/* Drawer-only: the utility strip that carries sign-in is hidden
                  on small screens, so the portal link has to live here too. */}
              <li className="nav__drawer-only">
                <a href={ADMIN_URL} onClick={() => setOpen(false)}>
                  Author sign-in
                </a>
              </li>
            </ul>
          </nav>

          <div className="tools">
            <button
              className="iconbtn"
              type="button"
              aria-label="Search articles"
              aria-expanded={searching}
              onClick={() => setSearching((s) => !s)}
            >
              <IconSearch />
            </button>

            <div className="lang" role="group" aria-label="Language">
              {/* No-op for now — the journal publishes in English. */}
              <button type="button" aria-pressed={false} lang="az">
                AZ
              </button>
              <button type="button" aria-pressed={true} lang="en">
                EN
              </button>
            </div>

            <button className="iconbtn theme" type="button" aria-label="Switch colour theme" onClick={toggleTheme}>
              <IconSun />
            </button>

            <a className="nav-cta" href={ADMIN_URL}>
              <IconOpenAccess />
              <span>Submit</span>
            </a>

            <button
              className="nav__burger"
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              aria-controls="links"
              onClick={() => setOpen((o) => !o)}
            >
              <IconBurger />
            </button>
          </div>
        </div>
      </header>

      {/* ---------- search panel ---------- */}
      {searching && (
        <div
          className="srch"
          role="dialog"
          aria-modal="true"
          aria-label="Search the journal"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSearching(false);
          }}
        >
          <div className="srch__box">
            <div className="srch__hd">
              <p className="annot">Search the journal</p>
              <button className="iconbtn" type="button" aria-label="Close search" onClick={() => setSearching(false)}>
                <IconClose />
              </button>
            </div>

            <form className="srch__form" action="/search" method="get" role="search">
              <IconSearch className="srch__ic" />
              <input
                ref={inputRef}
                className="srch__in"
                type="search"
                name="q"
                placeholder="Title, author, keyword…"
                autoComplete="off"
                aria-label="Search query"
              />
              <button className="srch__go" type="submit">
                Search
              </button>
            </form>

            <p className="srch__hint">
              Searches every article in the archive — <b>title</b>, <b>authors</b>, <b>keywords</b>. Press{" "}
              <b>Esc</b> to close.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
