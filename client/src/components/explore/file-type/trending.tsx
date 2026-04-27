"use client";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useGetTrendingStocks } from "@/hooks/use-stock";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/common/empty-state";
import StockCard from "@/components/common/stock-card";

const Trending = () => {
  const params = useParams();
  const fileType = (params.filetype as string) || "vectors";
  const formattedTitle = fileType
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const { data, isLoading } = useGetTrendingStocks({
    fileType: fileType,
    limit: 13,
  });
  const stocks = data?.stocks || [];

  if (isLoading) {
    return <TrendingSkeleton />;
  }

  return (
    <section className="container mx-auto px-4 lg:px-6 py-8 md:py-12 space-y-6">
      {stocks.length > 0 ? (
        <>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">
                Explore trending {formattedTitle} and illustrations
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Curated categories to spark your next creative idea.
              </p>
            </div>
            <Button
              variant="secondary"
              className="rounded-full bg-muted/50 hover:bg-muted text-sm font-medium px-6 hidden md:flex"
            >
              Discover free {formattedTitle.toLowerCase()}
            </Button>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
            {/* Desktop: First item spans 2 cols & 2 rows */}
            {stocks[0] && (
              <StockCard
                stock={stocks[0]}
                className="col-span-1 md:col-span-2 md:row-span-2 hidden md:block"
                useFill={true}
                useImagePadding={true}
                useImageLayer={true}
              />
            )}

            {/* Desktop: Remaining Items (1-8) */}
            {stocks.slice(1).map((item) => (
              <StockCard
                key={item.id}
                stock={item}
                className="hidden md:block col-span-1 row-span-1"
                useFill={true}
                objectFit="contain"
                useImageLayer={true}
                useImagePadding={true}
              />
            ))}

            {/* Mobile: Horizontal Scroll View */}
            <div className="md:hidden flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory col-span-1 h-[300px]">
              {stocks.map((item) => (
                <StockCard
                  key={item.id}
                  stock={item}
                  className="relative flex-none w-[85vw] h-full snap-center"
                  useFill={true}
                  objectFit="contain"
                  useImageLayer={true}
                  useImagePadding={true}
                />
              ))}
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full rounded-full bg-muted/50 hover:bg-muted text-sm font-medium md:hidden mt-28"
          >
            Discover free {formattedTitle.toLowerCase()}
          </Button>
        </>
      ) : (
        <EmptyState />
      )}
    </section>
  );
};

const TrendingSkeleton = () => {
  return (
    <section className="container mx-auto px-4 lg:px-6 py-8 md:py-12 space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div className="space-y-2 w-full">
          <Skeleton className="h-8 md:h-9 w-3/4 md:w-1/3" />
          <Skeleton className="h-4 md:h-5 w-1/2 md:w-1/4" />
        </div>
        <Skeleton className="h-10 w-48 rounded-full hidden md:flex" />
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
        {/* Desktop: First item spans 2 cols & 2 rows */}
        <Skeleton className="rounded-2xl col-span-1 md:col-span-2 md:row-span-2 hidden md:block" />

        {/* Desktop: Remaining Items (Simulate 8 items like original) */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="rounded-2xl col-span-1 row-span-1 hidden md:block"
          />
        ))}

        {/* Mobile: Horizontal Scroll View Skeleton */}
        <div className="md:hidden flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory col-span-1 h-[300px]">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-none w-[85vw] h-full rounded-2xl"
            />
          ))}
        </div>
      </div>
      {/* Mobile Button Skeleton */}
      <Skeleton className="w-full h-10 rounded-full md:hidden mt-4" />
    </section>
  );
};

export default Trending;
