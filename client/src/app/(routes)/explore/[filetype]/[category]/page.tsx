"use client";

import { Suspense, useMemo } from "react";
import FadeIn from "@/components/common/fade-in";
import StockCard from "@/components/common/stock-card";
import { Button } from "@/components/ui/button";

import { useGetFileTypes } from "@/hooks/use-file-type";
import { useGetCategoriesFromFiletype } from "@/hooks/use-categories";
import { useGetAllStocks } from "@/hooks/use-stock";

import { Loader2, FolderXIcon } from "lucide-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import IconReader from "@/components/common/icon-reader";
import { Skeleton } from "@/components/ui/skeleton";
import ExploreFilters from "@/components/common/explore-filters";

const ExploreContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useParams();

  const filetypeSlug = (params.filetype as string) || "vectors";
  const categorySlug = (params.category as string) || "backgrounds";

  const licenseParam = searchParams.get("license") || "all";
  const sortParam = searchParams.get("sort") || "relevance";

  // Hooks for fetching master data
  const { data: fileTypesData, isLoading: isLoadingFT } = useGetFileTypes({
    limit: 100,
  });
  const { data: categoriesData, isLoading: isLoadingCat } =
    useGetCategoriesFromFiletype(filetypeSlug);

  const fileTypes = fileTypesData?.fileTypes || [];
  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : (categoriesData as any)?.categories || [];

  const currentFileType = fileTypes.find((ft) => ft.slug === filetypeSlug);
  const currentCategory = categories.find(
    (cat: any) => cat.slug === categorySlug,
  );

  const formattedCategory =
    currentCategory?.name ||
    categorySlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Stocks Fetching
  const {
    data: stocksData,
    isLoading: isLoadingStocks,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllStocks({
    fileTypeId: currentFileType?.id,
    categoryId: currentCategory?.id,
    isPremium:
      licenseParam === "premium"
        ? "true"
        : licenseParam === "free"
          ? "false"
          : undefined,
    sortBy:
      sortParam === "newest"
        ? "createdAt"
        : sortParam === "relevance"
          ? undefined
          : "totalDownloads", // Defaults for sortBy
    sortOrder: "desc",
    limit: 20,
  });

  const stocks = useMemo(
    () => stocksData?.pages.flatMap((page) => page.stocks) || [],
    [stocksData],
  );
  const totalStocksCount = stocksData?.pages[0]?.totalCount || 0;

  const isDataReady = !isLoadingFT && !isLoadingCat;
  const isStocksLoading = !isDataReady || isLoadingStocks;

  // Handlers for Desktop Selectors
  const onFiletypeChange = (slug: string) => {
    router.push(`/explore/${slug}`);
  };

  const onCategoryChange = (slug: string) => {
    const sp = new URLSearchParams(searchParams);
    router.push(`/explore/${filetypeSlug}/${slug}?${sp.toString()}`);
  };

  const onSearchParamChange = (key: string, value: string) => {
    const sp = new URLSearchParams(searchParams);
    if (value === "all") {
      sp.delete(key);
    } else {
      sp.set(key, value);
    }
    router.push(`${pathname}?${sp.toString()}`);
  };

  // Handler for Mobile Apply Button
  const applyMobileFilters = (
    ft: string,
    cat: string,
    lic: string,
    sort: string,
  ) => {
    const sp = new URLSearchParams(searchParams);
    if (lic === "all") sp.delete("license");
    else sp.set("license", lic);

    if (sort === "relevance") sp.delete("sort");
    else sp.set("sort", sort);

    // If filetype hasn't changed, we safely route to the current base path
    if (ft === filetypeSlug) {
      router.push(`/explore/${filetypeSlug}/${cat}?${sp.toString()}`);
    } else {
      // If filetype changed, route to the newly validated category!
      router.push(`/explore/${ft}/${cat}?${sp.toString()}`);
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          {currentCategory?.icon && (
            <IconReader name={currentCategory.icon} className="size-8" />
          )}
          {formattedCategory} {currentFileType?.name || "Assets"}{" "}
        </h1>
        <span className="text-lg font-medium text-muted-foreground">
          {totalStocksCount > 0 && `(${totalStocksCount} assets)`}
        </span>
      </div>

      {/* Filter Bar */}
      <div className="border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60 sticky top-16 z-30 p-5 -mx-4 lg:-mx-6 px-4 lg:px-6">
        <ExploreFilters
          fileTypes={fileTypes}
          categories={categories}
          currentFiletype={filetypeSlug}
          currentCategory={categorySlug}
          currentLicense={licenseParam}
          currentSort={sortParam}
          onFiletypeChange={onFiletypeChange}
          onCategoryChange={onCategoryChange}
          onSearchParamChange={onSearchParamChange}
          onApplyMobileFilters={applyMobileFilters}
        />
      </div>

      {/* Masonry Grid */}
      {isStocksLoading && stocks.length === 0 ? (
        <div className="columns-1 md:columns-2 lg:columns-4 gap-4 space-y-4 pt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="break-inside-avoid shadow-none"
            >
              <Skeleton className="w-full h-[300px] rounded-2xl" />
            </div>
          ))}
        </div>
      ) : stocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <FolderXIcon className="h-12 w-12 mb-4 opacity-20" />
          <p className="text-lg font-medium">No assets found</p>
          <p className="text-sm">Try adjusting your filters or category.</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-4 gap-4 space-y-4 pt-4">
          {stocks.map((item: any) => (
            <div key={item.id} className="break-inside-avoid">
              <FadeIn>
                <StockCard stock={item} useFill={false} />
              </FadeIn>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center pt-8 pb-4">
          <Button
            variant="outline"
            className="rounded-full px-8 bg-white"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading...
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

const ExploreCategoryPage = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
};

export default ExploreCategoryPage;
