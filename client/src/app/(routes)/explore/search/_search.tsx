"use client";

import { Loader2, FolderXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/common/fade-in";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useGetAllStocks } from "@/hooks/use-stock";
import { useMemo, useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { useGetFileTypes } from "@/hooks/use-file-type";
import { useGetCategoriesFromFiletype } from "@/hooks/use-categories";
import ExploreFilters from "@/components/common/explore-filters";
import { Skeleton } from "@/components/ui/skeleton";
import StockCard from "@/components/common/stock-card";
import { MasonryPhotoAlbum, RenderImageProps } from "react-photo-album";
import "react-photo-album/masonry.css";

const SearchPages = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Params
  const search = searchParams.get("search") || "";
  const color = searchParams.get("color") || undefined;

  // Unified parameter resolution (supports old ID params from header or new slug params)
  const fileTypeParam =
    searchParams.get("fileType") || searchParams.get("fileTypeId") || "";
  const categoryParam =
    searchParams.get("category") || searchParams.get("categoryId") || "";

  const tempLicense = searchParams.get("license");
  const tempPremium = searchParams.get("isPremium");
  const licenseParam =
    tempLicense === "premium" || tempPremium === "true"
      ? "premium"
      : tempLicense === "free" || tempPremium === "false"
        ? "free"
        : "all";

  const sortParam =
    searchParams.get("sort") || searchParams.get("sortBy") || "relevance";

  // Hooks for fetching master data
  const { data: fileTypesData, isLoading: isLoadingFT } = useGetFileTypes({
    limit: 100,
  });
  const fileTypes = fileTypesData?.fileTypes || [];

  const currentFileType = fileTypes.find(
    (ft) => ft.slug === fileTypeParam || ft.id === fileTypeParam,
  );
  const filetypeSlug = currentFileType?.slug || "";
  const fileTypeId = currentFileType?.id;

  const { data: categoriesData, isLoading: isLoadingCat } =
    useGetCategoriesFromFiletype(
      filetypeSlug || "vectors", // Fallback to "vectors" to fetch some categories if empty
    );
  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : (categoriesData as any)?.categories || [];

  const currentCategory = categories.find(
    (cat: any) => cat.slug === categoryParam || cat.id === categoryParam,
  );
  const categorySlug = currentCategory?.slug || "";
  const categoryId = currentCategory?.id;

  // Data Fetching
  const {
    data: stocksData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingStocks,
  } = useGetAllStocks({
    search,
    categoryId,
    isPremium:
      licenseParam === "premium"
        ? "true"
        : licenseParam === "free"
          ? "false"
          : undefined,
    color,
    fileTypeId,
    sortBy:
      sortParam === "newest"
        ? "createdAt"
        : sortParam === "relevance"
          ? undefined
          : "totalDownloads",
    sortOrder: "desc",
    limit: 20,
  });

  const totalStocks = stocksData?.pages[0]?.totalCount || 0;
  const pageCount = stocksData?.pages.length || 0;
  const stocks = useMemo(
    () => stocksData?.pages.flatMap((page) => page.stocks) || [],
    [stocksData],
  );

  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && pageCount < 4) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, pageCount, fetchNextPage]);

  const isDataReady = !isLoadingFT && !isLoadingCat;
  const isPageLoading = !isDataReady || isLoadingStocks;

  const updateUrl = (params: URLSearchParams) => {
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Handlers for ExploreFilters
  const onFiletypeChange = (slug: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("fileType", slug);
    // Cleanup old keys
    sp.delete("fileTypeId");
    // Clear category since filetype changed
    sp.delete("category");
    sp.delete("categoryId");
    updateUrl(sp);
  };

  const onCategoryChange = (slug: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("category", slug);
    sp.delete("categoryId");
    updateUrl(sp);
  };

  const onSearchParamChange = (key: string, value: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      sp.delete(key);
      if (key === "license") sp.delete("isPremium");
    } else {
      sp.set(key, value);
      if (key === "license") sp.delete("isPremium");
      if (key === "sort") sp.delete("sortBy");
    }
    updateUrl(sp);
  };

  const applyMobileFilters = (
    ft: string,
    cat: string,
    lic: string,
    sort: string,
  ) => {
    const sp = new URLSearchParams(searchParams.toString());

    // License
    if (lic === "all") {
      sp.delete("license");
      sp.delete("isPremium");
    } else {
      sp.set("license", lic);
      sp.delete("isPremium");
    }

    // Sort
    if (sort === "relevance") {
      sp.delete("sort");
      sp.delete("sortBy");
    } else {
      sp.set("sort", sort);
      sp.delete("sortBy");
    }

    // Filetype / Category
    if (ft) {
      sp.set("fileType", ft);
      sp.delete("fileTypeId");
    } else {
      sp.delete("fileType");
      sp.delete("fileTypeId");
    }

    if (cat) {
      sp.set("category", cat);
      sp.delete("categoryId");
    } else {
      sp.delete("category");
      sp.delete("categoryId");
    }

    updateUrl(sp);
  };

  const getHeaderText = () => {
    if (search) return `Search results for "${search}"`;
    if (currentCategory) return `${currentCategory.name} results`;
    if (color) return `${color} vectors`;
    return "All vectors";
  };

  const photos = stocks.map((stock) => {
    const preview = stock.files.find((f) => f.purpose === "PREVIEW")!;
    return {
      src: preview.url,
      width: preview.width || 800,
      height: preview.height || 600,
      alt: stock.title,
      key: stock.id,
      stockData: stock,
    };
  });

  const renderPhoto = (imageProps: RenderImageProps, context: any) => {
    return (
      <StockCard
        stock={context.photo.stockData}
        style={{ width: "100%", height: "100%" }}
      />
    );
  };

  return (
    <div className="container mx-auto px-4 lg:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          {getHeaderText()}{" "}
        </h1>
        <span className="text-lg font-medium text-muted-foreground">
          ({totalStocks} assets)
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
      {isPageLoading && stocks.length === 0 ? (
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 pt-4">
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
        <div className="flex flex-col items-center justify-center py-32 text-center text-muted-foreground">
          <FolderXIcon className="h-16 w-16 mb-4 opacity-20" />
          <p className="text-xl font-medium">No results found</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="py-10 px-4 min-h-screen">
          <FadeIn className="space-x-4 space-y-4">
            <MasonryPhotoAlbum
              photos={photos}
              columns={(containerWidth) => {
                if (containerWidth < 428) return 1;
                if (containerWidth < 900) return 2;
                return 4;
              }}
              render={{ image: renderPhoto }}
              spacing={16}
            />
          </FadeIn>
        </div>
      )}

      {/* Load More */}
      {hasNextPage && (
        <div className="flex justify-center pt-8 pb-4">
          {pageCount < 4 ? (
            <div ref={ref} className="w-full h-10 flex justify-center items-center">
              {isFetchingNextPage && (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              className="rounded-full px-8 bg-white"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load more"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPages;
