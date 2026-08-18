"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  IconBurger,
  IconChevron,
  IconClose,
  IconOpenAccess,
  IconSearch,
  IconSun,
} from "@/components/icons";
// Author sign-in / submission live in the portal (admin-msj.aztu.edu.az); the
// public site only links out to it. See lib/site.ts for the three hosts.
import { ADMIN_URL } from "@/lib/site";
import { T, type Strings } from "@/lib/i18n";

interface NavItem {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

/** Built per-render so the labels follow the reader's language. */
function navItems(t: Strings): NavItem[] {
  return [
    { href: "/about", label: t.navAbout },
    { href: "/#current", label: t.navCurrent },
    { href: "/scope", label: t.navScope },
    { href: "/board", label: t.navBoard },
    { href: "/archive", label: t.navArchive },
    {
      href: "/authors",
      label: t.navAuthors,
      children: [
        { href: "/authors/manuscript", label: t.navManuscript },
        { href: "/authors/open-access", label: t.navOpenAccess },
        { href: "/authors/ai-policy", label: t.navAiPolicy },
      ],
    },
    { href: "/contact", label: t.navContact },
  ];
}

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
 * page navigation. There is no language control: the journal publishes in
 * English only.
 */
export default function SiteHeader() {
  const t = T;
  const NAV = navItems(t);
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
              <b>{t.openAccess}</b>
            </span>
            <span className="ubar__f">{t.peerReviewed}</span>
            <span className="ubar__f">
              <b>{t.freeOfCharge}</b>
            </span>
          </div>

          <div className="ubar__links">
            <a href="https://aztu.edu.az" target="_blank" rel="noopener">
              Azerbaijan Technical University
            </a>
            <Link href="/authors/open-access">{t.navOpenAccess}</Link>
            <a className="ubar__signin" href={ADMIN_URL}>
              {t.authorSignIn}
            </a>
          </div>
        </div>
      </div>

      {/* ---------- sticky bar ---------- */}
      <header className={"nav" + (stuck ? " stuck" : "")} id="nav">
        <div className="wrap nav__in">
          <Link className="brand" href="/">
            {/* The full AzTU lockup — emblem plus wordmark. width/height carry
                the intrinsic 350x480 so the browser reserves the right box
                before it loads; CSS sets the displayed height. */}
            <img className="brand__mark" src="/logo.png" alt="Azerbaijan Technical University" width={350} height={480} />
            <span className="brand__txt">
              {/* lang="en" is redundant while <html> is English, and kept
                  deliberately: it pins the Turkic dotted-I casing rule off this
                  string, so uppercasing can never render it MACHİNE. */}
              <span className="brand__name" lang="en">
                Machine Science
              </span>
              <span className="brand__sub">Est. 2001</span>
            </span>
          </Link>

          <nav aria-label={t.primaryNav}>
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
                  {t.authorSignIn}
                </a>
              </li>
            </ul>
          </nav>

          <div className="tools">
            <button
              className="iconbtn"
              type="button"
              aria-label={t.searchArticles}
              aria-expanded={searching}
              onClick={() => setSearching((s) => !s)}
            >
              <IconSearch />
            </button>


            <button className="iconbtn theme" type="button" aria-label={t.switchTheme} onClick={toggleTheme}>
              <IconSun />
            </button>

            <a className="nav-cta" href={ADMIN_URL}>
              <IconOpenAccess />
              <span>{t.submit}</span>
            </a>

            <button
              className="nav__burger"
              type="button"
              aria-label={t.menu}
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
          aria-label={t.searchTheJournal}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSearching(false);
          }}
        >
          <div className="srch__box">
            <div className="srch__hd">
              <p className="annot">{t.searchTheJournal}</p>
              <button className="iconbtn" type="button" aria-label={t.closeSearch} onClick={() => setSearching(false)}>
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
                placeholder={t.searchPlaceholder}
                autoComplete="off"
                aria-label={t.searchArticles}
              />
              <button className="srch__go" type="submit">
                {t.searchButton}
              </button>
            </form>

            <p className="srch__hint">{t.searchHint}</p>
          </div>
        </div>
      )}
    </>
  );
}
