"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// One auto-advancing hero slide. Captions are pre-resolved to English by the
// server component, so this island stays purely presentational + timing logic.
export interface HeroSlide {
  imageUrl: string;
  altText: string;
  caption: string;
}

// Dwell time per slide, matching the approved design.
const DWELL = 6000;

/**
 * Hero background slider — the design's crossfading, Ken-Burns carousel, isolated
 * as the page's one interactive island. The static hero copy (eyebrow, masthead,
 * lede, CTAs, specs) is passed in as server-rendered `children`, so it stays in
 * the initial HTML for crawlers; only the slide timing runs on the client.
 *
 * Structure mirrors the original <section class="hero">: the .slides backdrop,
 * then the copy, then the .hero__foot caption + dots.
 */
export default function HeroSlider({
  slides,
  children,
}: {
  slides: HeroSlide[];
  children: React.ReactNode;
}) {
  const n = slides.length;
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true); // did the last change come from the timer?
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const reduce = useRef(false);

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    if (reduce.current || n <= 1) return;
    timer.current = setInterval(() => {
      setAuto(true);
      setIdx((i) => (i + 1) % n);
    }, DWELL);
  }, [n, stop]);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const hero = heroRef.current;
    let io: IntersectionObserver | undefined;
    // Pause the carousel while the hero is scrolled out of view.
    if (hero && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) start();
          else stop();
        },
        { threshold: 0.15 }
      );
      io.observe(hero);
    } else {
      start();
    }

    // ...and while the tab is hidden.
    const onVis = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [start, stop]);

  function go(i: number) {
    setAuto(false); // manual jump: don't run the dot fill animation
    setIdx(((i % n) + n) % n);
    start(); // reset the dwell clock
  }

  const capN = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <section className="hero" ref={heroRef}>
      {n > 0 && (
        <div className="slides" id="slides">
          {slides.map((s, i) => (
            <figure key={i} className={"slide" + (i === idx ? " on" : "")}>
              {/* first frame eager for LCP; the rest lazy */}
              <img
                src={s.imageUrl}
                alt={s.altText}
                loading={i === 0 ? undefined : "lazy"}
                decoding="async"
              />
            </figure>
          ))}
        </div>
      )}

      {children}

      {n > 0 && (
        <div className="wrap hero__foot">
          <div className="cap">
            <span className="cap__k" id="capK">
              {capN(idx)} / {capN(n - 1)}
            </span>
            <span className="cap__t" id="capT">
              {/* keyed by idx so the caption entrance animation replays */}
              <span key={idx}>{slides[idx]?.caption}</span>
            </span>
          </div>
          <div
            className="dots"
            id="dots"
            role="tablist"
            aria-label="Slides"
            style={{ ["--dwell" as string]: `${DWELL}ms` } as React.CSSProperties}
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-label={`Slide ${i + 1}`}
                aria-current={i === idx}
                className={i === idx && auto && !reduce.current ? "run" : undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
