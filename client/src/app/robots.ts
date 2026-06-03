import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vectolio.com";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/explore/", "/stock/", "/pricing", "/blog/"],
      disallow: [
        "/vectyzen/", // Creator dashboard
        "/admin/", // Admin panel (if any)
        "/api/", // Internal API routes
        "/_next/", // Next.js internals
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
