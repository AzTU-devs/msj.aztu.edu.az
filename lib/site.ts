// The three hosts this deployment spans. Declared once because they were
// previously re-declared in eleven files — and the submission link, which is
// the site's single most important outbound link, was defaulting to a LAN IP
// (http://10.3.43.77:5000) that no reader outside the university can reach.
//
// Production:
//   msj.aztu.edu.az        this site
//   api-msj.aztu.edu.az    backend API (proxied at /api and /files)
//   admin-msj.aztu.edu.az  author + editor portal (submission, sign-in)
//
// All three are overridable at build time; NEXT_PUBLIC_* values are inlined
// into the client bundle, so they must be set before `next build`, not at run.

/** Canonical origin of the public site. Used for canonicals, JSON-LD, sitemap. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://msj.aztu.edu.az").replace(/\/$/, "");

/** Author sign-in and manuscript submission live in the portal, not here. */
export const ADMIN_URL = (process.env.NEXT_PUBLIC_ADMIN_URL || "https://admin-msj.aztu.edu.az").replace(/\/$/, "");

/**
 * Backend origin as the *browser* would reach it. Same-origin `/api` rewrites
 * are the normal path (see next.config.mjs), so this is only used for resource
 * hints — preconnecting to the API host before the first client fetch.
 */
export const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL || "https://api-msj.aztu.edu.az"
).replace(/\/$/, "");

/** Absolute URL for a site-relative path (leaves absolute URLs untouched). */
export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
