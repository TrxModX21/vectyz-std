import { Metadata } from "next";
import { Suspense } from "react";
import ArticleListClient from "./article-list-client";
import Header from "@/components/landing/header";
import Footer from "@/components/common/footer";
import { Loader2 } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3021/api/v1";
    const res = await fetch(`${baseUrl}/blog/settings`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (res.ok) {
      const json = await res.json();
      const settings = json.data;

      return {
        title: settings?.defaultSeoTitle || "Articles",
        description:
          settings?.defaultSeoDescription ||
          "Insights, tutorials, and inspiration for designers and developers.",
        openGraph: {
          title: settings?.defaultSeoTitle || "Articles | Vectolio",
          description:
            settings?.defaultSeoDescription ||
            "Insights, tutorials, and inspiration for designers and developers.",
          type: "website",
          url: "/article",
          images: settings?.defaultSocialImage
            ? [{ url: settings.defaultSocialImage, width: 1200, height: 630 }]
            : undefined,
        },
        twitter: {
          card: "summary_large_image",
          title: settings?.defaultSeoTitle || "Articles | Vectolio",
          description:
            settings?.defaultSeoDescription ||
            "Insights, tutorials, and inspiration for designers and developers.",
          images: settings?.defaultSocialImage
            ? [settings.defaultSocialImage]
            : undefined,
        },
        alternates: { canonical: "/article" },
      };
    }
  } catch (error) {
    console.error("Error generating metadata for articles:", error);
  }

  return {
    title: "Articles",
    description:
      "Insights, tutorials, and inspiration for designers and developers.",
  };
}

function ArticleLoadingFallback() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="flex-1 flex justify-center items-center py-40">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
      <Footer />
    </main>
  );
}

export default function ArticlePage() {
  return (
    <Suspense fallback={<ArticleLoadingFallback />}>
      <ArticleListClient />
    </Suspense>
  );
}
