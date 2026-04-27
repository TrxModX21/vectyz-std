"use client";

import { useGetTrendingStocks } from "@/hooks/use-stock";
import { Skeleton } from "@/components/ui/skeleton";
import StockCard from "../common/stock-card";
import FadeIn from "../common/fade-in";

const TrendingLandingSection = () => {
  const { data, isLoading } = useGetTrendingStocks({ limit: 24 });
  const stocks = data?.stocks || [];

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8">
      <div className="flex flex-col items-center justify-center mb-10 gap-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
          Trending Stock <br className="md:hidden" /> This Month
        </h2>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <TrendingLandingSkeleton key={i} />
            ))
          : stocks.map((item, index) => {
              return (
                <FadeIn key={item.id} delay={index * 0.05}>
                  <StockCard
                    stock={item}
                    className="break-inside-avoid"
                    useFill={false}
                  />
                </FadeIn>
              );
            })}
      </div>
    </div>
  );
};

const TrendingLandingSkeleton = () => {
  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-200 flex-auto h-[240px] md:h-[280px] min-w-[300px]">
      <Skeleton className="h-full w-full" />
      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
        <Skeleton className="h-4 w-3/4 mb-2 bg-gray-300" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-full bg-gray-300" />
            <Skeleton className="h-3 w-16 bg-gray-300" />
          </div>
          <Skeleton className="h-3 w-8 bg-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default TrendingLandingSection;
