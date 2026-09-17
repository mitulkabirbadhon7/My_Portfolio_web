import type { MetadataRoute } from "next";

// Production Canonical Domain from docs/CONFIG.md
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mitulkabirbadhon.me";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/projects", "/contact"],
      disallow: ["/admin/", "/admin"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
