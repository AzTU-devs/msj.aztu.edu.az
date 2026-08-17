import type { MetadataRoute } from "next";
import { api, type Issue } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

// Rebuild the sitemap hourly so new issues/articles appear without a redeploy.
export const revalidate = 3600;

/** Absolute URL for a possibly-relative media path served by the API proxy. */
function absolute(path: string | null | undefined): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Newest issue first, so priority can decay with age. */
function orderIssues(issues: Issue[]): Issue[] {
  return issues
    .slice()
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || (b.number ?? 0) - (a.number ?? 0));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/archive`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/board`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/scope`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/authors`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  let issueRoutes: MetadataRoute.Sitemap = [];
  try {
    const issues = orderIssues(await api.issues());
    issueRoutes = issues.map((i, rank) => {
      const cover = absolute(i.coverUrl);
      return {
        url: `${SITE_URL}/issues/${i.slug}`,
        lastModified: i.publishedAt ? new Date(i.publishedAt) : now,
        // The current issue is the one that keeps changing; back issues are
        // fixed records. Decay the priority so crawl budget follows that.
        changeFrequency: rank === 0 ? ("weekly" as const) : ("yearly" as const),
        priority: rank === 0 ? 0.9 : 0.7,
        ...(cover ? { images: [cover] } : {}),
      };
    });
  } catch {
    // Backend unavailable at build time — ship the static routes rather than fail.
  }

  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const page = await api.articles({ size: 2000 });
    articleRoutes = page.content.map((a) => ({
      url: `${SITE_URL}/articles/${a.id}`,
      lastModified: a.publishedAt ? new Date(a.publishedAt) : now,
      changeFrequency: "yearly",
      // Articles are the pages that should rank; keep them above the section
      // pages but below the archive that links them all.
      priority: 0.8,
    }));
  } catch {
    // ditto
  }

  return [...staticRoutes, ...issueRoutes, ...articleRoutes];
}
