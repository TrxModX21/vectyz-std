"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetPopularFreeVector } from "@/hooks/use-stock";
import FadeIn from "../common/fade-in";
import StockCard from "../common/stock-card";
import { ColumnsPhotoAlbum, RenderImageProps } from "react-photo-album";
import "react-photo-album/columns.css";

const PopularLandingSection = () => {
  const { data, isLoading } = useGetPopularFreeVector();
  const stocks = data?.stocks || [];

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
    <div className="container mx-auto px-4 lg:px-6 py-8">
      <div className="flex flex-col items-center justify-center mb-10 gap-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
          Popular Royalty <br className="md:hidden" /> free vector
        </h2>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <PopularLandingSkeleton key={i} />
          ))
        ) : (
          <FadeIn>
            <ColumnsPhotoAlbum
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
        )}
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
