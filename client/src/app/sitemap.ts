import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vectolio.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3021/api/v1";

  // 1. Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/explore/vectors`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore/photos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore/psd`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    // 2. Fetch all approved stock slugs from backend
    const res = await fetch(`${apiUrl}/stocks/sitemap/all`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      console.error("Failed to fetch sitemap stocks");
      return staticRoutes;
    }

    const data = await res.json();
    const stocks: { slug: string; updatedAt: string }[] = data.stocks || [];

    // 3. Map stocks to sitemap entries
    const dynamicRoutes: MetadataRoute.Sitemap = stocks.map((stock) => ({
      url: `${baseUrl}/stock/${stock.slug}`,
      lastModified: new Date(stock.updatedAt),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticRoutes;
  }
}
