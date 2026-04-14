"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetPopularFreeVector } from "@/hooks/use-stock";
import StockCard from "./stock-card";

const PopularLandingSection = () => {
  const { data, isLoading } = useGetPopularFreeVector();
  const stocks = data?.stocks || [];

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8">
      <div className="flex flex-col items-center justify-center mb-10 gap-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
          Popular Royalty <br className="md:hidden" /> free vector
        </h2>
      </div>

      <div className="flex flex-wrap gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <PopularLandingSkeleton key={i} />
            ))
          : stocks.map((item) => {
              const preview = item.files.find(
                (f) => f.purpose === "PREVIEW",
              )?.url;
              const originalFile = item?.files.find(
                (f) => f.purpose === "ORIGINAL",
              );

              const width = originalFile?.width || 800;
              const height = originalFile?.height || 600;
              const aspectRatio = width / height;

              return (
                <StockCard
                  key={item.id}
                  stock={item}
                  aspectRatio={aspectRatio}
                  preview={preview}
                />
              );
            })}
      </div>
    </div>
  );
};

const PopularLandingSkeleton = () => {
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

export default PopularLandingSection;
