import FadeIn from "@/components/common/fade-in";
import Categories from "@/components/explore/file-type/categories";
import Hero from "@/components/explore/file-type/hero";
import Trending from "@/components/explore/file-type/trending";
import { Metadata, ResolvingMetadata } from "next";

// 1. Definisikan tipe Props, ingat params adalah Promise
type Props = {
  params: Promise<{ filetype: string }>;
};
// 2. Tambahkan generateMetadata
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const resolvedParams = await params;
  const filetypeSlug = resolvedParams.filetype; // ex: "vectors", "photos", "psd"
  // Mempercantik nama untuk Title (contoh: "vectors" jadi "Vectors", "psd" jadi "PSD")
  const formattedTitle =
    filetypeSlug.toLowerCase() === "psd"
      ? "PSD"
      : filetypeSlug.charAt(0).toUpperCase() + filetypeSlug.slice(1);
  const pageTitle = `Free & Premium ${formattedTitle}`;
  const pageDesc = `Explore our extensive collection of high-quality ${formattedTitle} for your next creative design project.`;
  return {
    title: pageTitle, // Akan otomatis menjadi: "Free & Premium Vectors | Vectolio"
    description: pageDesc,
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: `/explore/${filetypeSlug}`,
      images: [
        {
          // Opsional: Kamu bisa menyiapkan gambar OG berbeda untuk tiap kategori!
          // Misalnya buat gambar khusus di public: /og-vectors.png, /og-photos.png
          // Jika tidak ada, gunakan default logo/og-image utama.
          url: `/logo.png`,
          width: 1200,
          height: 630,
          alt: `${formattedTitle} Assets on Vectolio`,
        },
      ],
    },
  };
}

const ExploreFileTypePage = () => {
  return (
    <>
      <FadeIn>
        <Hero />
        <Trending />
      </FadeIn>
      <FadeIn>
        <Categories />
      </FadeIn>
      {/* <FadeIn>
        <SectionSeparator />
        <Collection />
      </FadeIn> */}
    </>
  );
};

export default ExploreFileTypePage;
