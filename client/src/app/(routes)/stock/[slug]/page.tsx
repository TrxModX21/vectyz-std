import { Metadata, ResolvingMetadata } from "next";
import StockClientPage from "./stock-client"; // Import file yang barusan di-rename

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // 2. Await params sebelum mengakses propertinya!
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  try {
    // Sesuaikan URL ini dengan endpoint API backend kamu yang sebenarnya!
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3021/api/v1";
    const res = await fetch(`${baseUrl}/stocks/${slug}`, {
      next: { revalidate: 60 },
    });
    // ... (kode sisanya sama persis seperti sebelumnya) ...
    if (!res.ok) {
      return { title: "Asset Not Found" };
    }

    const data = await res.json();
    const stock = data.stock;

    // Cari file preview untuk dijadikan gambar thumbnail saat di-share
    const previewFile = stock?.files?.find((f: any) => f.purpose === "PREVIEW");
    const imageUrl = previewFile?.url || "/logo.png";

    return {
      title: stock.title,
      description:
        stock.description?.substring(0, 160) ||
        "Download high-quality digital assets.",
      openGraph: {
        title: stock.title,
        description: stock.description,
        type: "article",
        url: `/stock/${slug}`,
        images: [
          {
            url: imageUrl,
            width: previewFile?.width || 1200,
            height: previewFile?.height || 630,
            alt: stock.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: stock.title,
        description: stock.description,
        images: [imageUrl],
      },
      alternates: { canonical: `/stock/${slug}` },
    };
  } catch (error) {
    console.error("Error generating metadata for stock:", error);
    return { title: "Stock Detail" };
  }
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3021/api/v1";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vectolio.com";
  
  let jsonLd = null;
  try {
    const res = await fetch(`${baseUrl}/stocks/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const stock = data.stock;
      const previewFile = stock?.files?.find((f: any) => f.purpose === "PREVIEW");
      const imageUrl = previewFile?.url || `${appUrl}/logo.png`;

      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: stock.title,
        description: stock.description,
        image: imageUrl,
        sku: stock.id,
        offers: {
          "@type": "Offer",
          url: `${appUrl}/stock/${slug}`,
          priceCurrency: "IDR",
          price: stock.price,
          availability: stock.status === "APPROVED" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
      };
    }
  } catch (err) {
    console.error("Failed to fetch stock for json-ld", err);
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <StockClientPage />
    </>
  );
}
