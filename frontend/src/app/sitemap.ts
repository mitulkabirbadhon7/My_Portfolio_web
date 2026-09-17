import type { MetadataRoute } from "next";

// Production Canonical Domain from docs/CONFIG.md
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mitulkabirbadhon.me";
const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic project routes: published project slugs only
  let dynamicProjectRoutes: MetadataRoute.Sitemap = [];
  try {
    const cleanApiBase = RAW_API_URL.replace(/\/+$/, "");
    const res = await fetch(`${cleanApiBase}/projects`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const payload = await res.json();
      if (Array.isArray(payload?.data)) {
        dynamicProjectRoutes = payload.data
          .filter(
            (p: { isPublished?: boolean; slug?: string }) =>
              p && p.isPublished === true && Boolean(p.slug)
          )
          .map((p: { slug: string; updatedAt?: string }) => ({
            url: `${BASE_URL}/projects/${encodeURIComponent(p.slug)}`,
            lastModified: p.updatedAt ? new Date(p.updatedAt) : currentDate,
            changeFrequency: "weekly" as const,
            priority: 0.8,
          }));
      }
    }
  } catch (error) {
    console.warn("[Sitemap Generation] Unable to dynamically fetch project slugs:", error);
  }

  return [...staticRoutes, ...dynamicProjectRoutes];
}
