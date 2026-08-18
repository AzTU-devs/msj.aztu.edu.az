import type { MetadataRoute } from "next";

/**
 * Web app manifest. Not a PWA ambition — it is what lets a reader who saves the
 * journal to a phone home screen get the masthead and the right chrome colour
 * instead of a screenshot thumbnail, and it is one of the signals Lighthouse
 * and Bing both look for.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Machine Science — International Scientific & Technical Journal",
    short_name: "Machine Science",
    description:
      "International scientific and technical journal on the theory of mechanisms and machines, published by Azerbaijan Technical University since 2001.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    lang: "en",
    dir: "ltr",
    categories: ["education", "science", "books"],
    icons: [
      // Next serves the generated routes for app/icon.png and app/apple-icon.png;
      // the manifest points at the same emblem so an installed shortcut matches
      // the browser tab.
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
