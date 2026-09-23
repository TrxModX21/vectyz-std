import { Metadata, ResolvingMetadata } from "next";
import ArticleClientPage from "./article-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3021/api/v1";
    const res = await fetch(`${baseUrl}/blog/posts/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return { title: "Article Not Found" };
    }

    const json = await res.json();
    const post = json.data;

    const imageUrl = post.coverImage || "/logo.png";
    const description =
      post.seoDescription ||
      post.excerpt ||
      post.content?.substring(0, 160) ||
      "Read the latest articles on Vectolio.";

    return {
      title: post.seoTitle || post.title,
      description,
      openGraph: {
        title: post.seoTitle || post.title,
        description,
        type: "article",
        url: `/article/${slug}`,
        publishedTime: post.publishedAt,
        authors: post.author?.name ? [post.author.name] : undefined,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.seoTitle || post.title,
        description,
        images: [imageUrl],
      },
      alternates: { canonical: `/article/${slug}` },
    };
  } catch (error) {
    console.error("Error generating metadata for article:", error);
    return { title: "Article Detail" };
  }
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3021/api/v1";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vectolio.com";

  let jsonLd = null;
  try {
    const res = await fetch(`${baseUrl}/blog/posts/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      const post = json.data;
      const imageUrl = post.coverImage || `${appUrl}/logo.png`;

      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description:
          post.seoDescription ||
          post.excerpt ||
          post.content?.substring(0, 160),
        image: imageUrl,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: {
          "@type": "Person",
          name: post.author?.name || "Vectolio Team",
        },
        publisher: {
          "@type": "Organization",
          name: "Vectolio",
          logo: {
            "@type": "ImageObject",
            url: `${appUrl}/logo.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${appUrl}/article/${slug}`,
        },
      };
    }
  } catch (err) {
    console.error("Failed to fetch article for json-ld", err);
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ArticleClientPage />
    </>
  );
}
