import { cookies } from "next/headers";
import { LOCALE_COOKIE, toLocale, type Locale } from "@/lib/i18n";

/**
 * The reader's language, from the cookie the header toggle writes.
 *
 * Server-only: `next/headers` cannot be imported from a client component, which
 * is why the dictionary lives in lib/i18n.ts and only this resolver lives here.
 *
 * Reading a cookie opts a route out of static rendering, so every page that
 * calls this becomes dynamic. That is the deliberate trade for a language
 * switch that works without a /az URL prefix: the underlying api.* fetches are
 * still cached (`revalidate: 300`), so the backend is not hit per request —
 * only the HTML is rendered per request.
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return toLocale(store.get(LOCALE_COOKIE)?.value);
}
