import type { MetadataRoute } from "next";
import { api } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://msj.aztu.edu.az";

// Rebuild the sitemap hourly so new issues/articles appear without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/scope`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/board`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/archive`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/authors`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  let issueRoutes: MetadataRoute.Sitemap = [];
  try {
    const issues = await api.issues();
    issueRoutes = issues.map((i) => ({
      url: `${SITE_URL}/issues/${i.slug}`,
      lastModified: i.publishedAt ? new Date(i.publishedAt) : now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch {
    // Backend unavailable at build time — ship the static routes rather than fail.
  }

  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const page = await api.articles({ size: 1000 });
    articleRoutes = page.content.map((a) => ({
      url: `${SITE_URL}/articles/${a.id}`,
      lastModified: a.publishedAt ? new Date(a.publishedAt) : now,
      changeFrequency: "yearly",
      priority: 0.7,
    }));
  } catch {
    // ditto
  }

  return [...staticRoutes, ...issueRoutes, ...articleRoutes];
}
