import FadeIn from "@/components/common/fade-in";
import Categories from "@/components/explore/file-type/categories";
import Hero from "@/components/explore/file-type/hero";
import Trending from "@/components/explore/file-type/trending";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ filetype: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const resolvedParams = await params;
  const filetypeSlug = resolvedParams.filetype; 
  
  const formattedTitle =
    filetypeSlug.toLowerCase() === "psd"
      ? "PSD"
      : filetypeSlug.charAt(0).toUpperCase() + filetypeSlug.slice(1);
  const pageTitle = `Free & Premium ${formattedTitle}`;
  const pageDesc = `Explore our extensive collection of high-quality ${formattedTitle} for your next creative design project.`;
  
  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: `/explore/${filetypeSlug}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: `/explore/${filetypeSlug}`,
      images: [
        {
          url: `/logo.png`,
          width: 1200,
          height: 630,
          alt: `${formattedTitle} Assets on Vectolio`,
        },
      ],
    },
  };
}

const ExploreFileTypePage = async ({ params }: Props) => {
  const resolvedParams = await params;
  const filetypeSlug = resolvedParams.filetype;
  
  const formattedTitle =
    filetypeSlug.toLowerCase() === "psd"
      ? "PSD"
      : filetypeSlug.charAt(0).toUpperCase() + filetypeSlug.slice(1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Free & Premium ${formattedTitle}`,
    description: `Explore our extensive collection of high-quality ${formattedTitle} for your next creative design project.`,
    url: `${process.env.NEXT_PUBLIC_APP_URL || "https://vectolio.com"}/explore/${filetypeSlug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
