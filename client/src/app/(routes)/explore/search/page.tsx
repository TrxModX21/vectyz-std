import { Suspense } from "react";
import SearchPages from "./_search";
import { Metadata } from "next";

// Define tipe props untuk halaman ini (Next.js otomatis passing searchParams)
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
// Fungsi ini berjalan di Server (SSR) sebelum komponen di render
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  // Ambil parameter dari URL
  const query = searchParams.search;
  const category = searchParams.category;
  const color = searchParams.color;
  // Logika sederhana untuk menentukan Title
  let pageTitle = "Explore Digital Assets";
  let pageDesc =
    "Search and explore thousands of high-quality digital assets on Vectolio.";
  if (query) {
    pageTitle = `${query} Vectors & Graphics`;
    pageDesc = `Download high-quality ${query} vectors, photos, and PSD files for your next creative project.`;
  } else if (category) {
    pageTitle = `${category} Assets`;
    pageDesc = `Explore our collection of premium and free ${category}.`;
  } else if (color) {
    pageTitle = `${color} Themed Assets`;
  }
  return {
    title: pageTitle, // Akan otomatis menjadi: "[pageTitle] | Vectolio" berkat layout.tsx
    description: pageDesc,
    openGraph: {
      title: pageTitle,
      description: pageDesc,
    },
    // Jika perlu, tambahkan robots: { index: false } jika search query-nya kosong,
    // agar Google tidak mengindex halaman blank.
  };
}

const SearchPage = () => {
  return (
    <Suspense fallback={<>...</>}>
      <SearchPages />
    </Suspense>
  );
};

export default SearchPage;
