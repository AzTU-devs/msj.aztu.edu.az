"use client";
import { useEffect } from "react";

/**
 * Scroll-reveal island for SSR pages. The approved design animates every
 * `.rv` block in as it enters the viewport; that `.rv{opacity:0}` rule lives
 * in design.css and, on the client-rendered homepage, was driven by the
 * DesignHome script. Standalone server pages have no such script, so drop this
 * once per page to reproduce the exact same reveal (same threshold, stagger and
 * fallbacks as the original) without pulling in any of the homepage JS.
 *
 * Renders a <noscript> style so the content is still fully visible when
 * JavaScript is off — `.rv` would otherwise stay at opacity:0.
 */
export default function Reveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".rv:not(.in)"));
    if (!els.length) return;

    const revealAll = () => els.forEach((el) => el.classList.add("in"));

    if (!("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    let fired = false;
    const io = new IntersectionObserver(
      (entries) => {
        fired = true;
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 60}ms`;
      io.observe(el);
    });

    // Net: if the observer never reported (rare), reveal everything anyway.
    const t = window.setTimeout(() => {
      if (!fired) revealAll();
    }, 2500);

    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, []);

  return (
    <noscript>
      <style dangerouslySetInnerHTML={{ __html: ".rv{opacity:1;transform:none}" }} />
    </noscript>
  );
}
