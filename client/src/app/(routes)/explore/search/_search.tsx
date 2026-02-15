"use client";

import {
  ChevronDown,
  LayoutGrid,
  Settings,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FadeIn from "@/components/common/fade-in";
import ItemCard from "@/components/explore/item-card";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetAllStocks } from "@/hooks/use-stock";
import { useEffect, useState, useCallback } from "react";
import { StockDetailDialog } from "@/components/stock-detail-dialog/stock-detail-dialog";

const SearchPages = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Params
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || undefined;
  const isPremium = searchParams.get("isPremium") || undefined;
  const color = searchParams.get("color") || undefined;
  const fileTypeId = searchParams.get("fileTypeId") || undefined;
  const sortBy = (searchParams.get("sortBy") as any) || "newest";

  // Data Fetching
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useGetAllStocks({
    search,
    categoryId,
    isPremium,
    color,
    fileTypeId,
    sortBy:
      sortBy === "newest"
        ? "createdAt"
        : sortBy === "relevance"
          ? undefined
          : "totalDownloads", // Simple mapping
    sortOrder: "desc",
    limit: 20,
  });

  // Re-fetch when params change
  useEffect(() => {
    // React Query handles this automatically via queryKey, but if we need manual refetch:
    // refetch();
  }, [search, categoryId, isPremium, color, fileTypeId, sortBy]); // queryKey handles it

  const totalStocks = data?.pages[0]?.totalCount || 0;
  const stocks = data?.pages.flatMap((page) => page.stocks) || [];

  const updateSort = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", newSort);
    router.replace(`/explore/search?${params.toString()}`);
  };

  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Wrap in useCallback to prevent re-creation on every render
  const handleStockClick = useCallback((stock: any) => {
    setSelectedStock(stock);
    setIsDialogOpen(true);
  }, []);

  const getHeaderText = () => {
    if (search) return `Search results for "${search}"`;
    if (categoryId) return "Category results";
    if (color) return `${color} vectors`;
    return "All vectors";
  };

  return (
    <div className="container mx-auto px-4 lg:px-6 py-6 space-y-6 mt-10 mb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          {getHeaderText()}{" "}
          <span className="text-muted-foreground text-lg font-normal">
            ({totalStocks} stocks)
          </span>
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden md:inline-block">
            Sort by:
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 font-normal capitalize"
              >
                {sortBy === "createdAt" ? "Newest" : sortBy}{" "}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => updateSort("relevance")}>
                Relevance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateSort("newest")}>
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateSort("trending")}>
                Trending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Masonry Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : stocks.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {stocks.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid cursor-pointer"
              onClick={() => handleStockClick(item)}
            >
              <FadeIn>
                <ItemCard
                  item={{
                    ...item,
                    width:
                      item.files?.find((f: any) => f.purpose === "PREVIEW")
                        ?.width || 800,
                    height:
                      item.files?.find((f: any) => f.purpose === "PREVIEW")
                        ?.height || 600,
                    image:
                      item.files?.find((f: any) => f.purpose === "PREVIEW")
                        ?.url || "/placeholder.jpg",
                  }}
                />
              </FadeIn>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No results found.
          </p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      )}

      {/* Load More */}
      {hasNextPage && (
        <div className="flex justify-center pt-8 pb-4">
          <Button
            variant="outline"
            className="rounded-full px-8"
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
        </div>
      )}

      <StockDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        stock={selectedStock}
        onStockSelect={setSelectedStock}
      />
    </div>
  );
};

export default SearchPages;
