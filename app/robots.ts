import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /search is an infinite space of query permutations and every result
        // it can show is already reachable from /archive; /api is the backend
        // proxy. Neither should burn crawl budget.
        disallow: ["/search", "/api/"],
      },
      {
        // Scholar indexes the article pages themselves, and it needs the PDF
        // endpoint reachable to attach the [PDF] link from citation_pdf_url.
        userAgent: "Googlebot",
        allow: ["/", "/api/v1/articles/"],
        disallow: ["/search"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
