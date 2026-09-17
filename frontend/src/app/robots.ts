import type { MetadataRoute } from "next";

// Read PRODUCTION_DOMAIN from docs/CONFIG.md (currently TBD)
// TODO: replace with production domain
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/projects", "/contact", "/support"],
      disallow: ["/admin/", "/admin"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
