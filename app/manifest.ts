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
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
