"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALES, LOCALE_COOKIE, LOCALE_LABEL, type Locale } from "@/lib/i18n";

/**
 * AZ / EN switch.
 *
 * This was a pair of buttons with `aria-pressed` hardcoded and no handler — it
 * looked like a language switch and did nothing. It now writes the locale
 * cookie and asks the server to re-render: every page reads the cookie through
 * lib/locale.ts, so both the UI chrome and the backend's I18nText content come
 * back in the chosen language.
 *
 * `router.refresh()` rather than a full reload so scroll position and the
 * article you are reading survive the switch; `useTransition` keeps the old
 * text on screen until the new render arrives instead of flashing empty.
 */
export default function LangToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(next: Locale) {
    if (next === locale) return;
    // A year, site-wide. Lax is enough: this is a display preference, and it
    // must survive following a link in from Google or an e-mail.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div className="lang" role="group" aria-label="Language / Dil" data-pending={pending || undefined}>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={l === locale}
          onClick={() => choose(l)}
        >
          {LOCALE_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
