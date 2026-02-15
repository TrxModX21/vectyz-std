"use client";

import Image from "next/image";
import { Heart, Crown, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blurDataURL } from "@/lib/helpers";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPopularFreeVector } from "@/hooks/use-stock";
import Link from "next/link";
import { useState } from "react";
import { StockDetailDialog } from "../stock-detail-dialog/stock-detail-dialog";

const PopularLandingSection = () => {
  const { data, isLoading } = useGetPopularFreeVector();
  const stocks = data?.stocks || [];

  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleStockClick = (stock: any) => {
    setSelectedStock(stock);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8">
      <div className="flex flex-col items-center justify-center mb-10 gap-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
          Popular Royalty <br className="md:hidden" /> free vector
        </h2>
      </div>

      <div className="flex flex-wrap gap-4 max-h-[500px] md:max-h-[580px] overflow-hidden">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <PopularLandingSkeleton key={i} />
            ))
          : stocks.map((item) => {
              const preview = item.files.find(
                (f) => f.purpose === "PREVIEW",
              )?.url;

              return (
                <div
                  key={item.id}
                  className="relative group rounded-xl overflow-hidden bg-gray-100 flex-auto h-[240px] md:h-[280px]"
                  onClick={() => handleStockClick(item)}
                >
                  <Image
                    src={preview || "/placeholder.jpg"}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 min-w-[150px]"
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    width={500}
                    height={500}
                  />

                  {/* Crown Icon (Top Left) */}
                  <div className="absolute top-2 left-2">
                    {item.isPremium && (
                      <div className="bg-gray-600/80 backdrop-blur-sm p-1.5 rounded-md text-orange-400">
                        <Crown className="w-4 h-4 fill-orange-400" />
                      </div>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 md:p-4">
                    {/* Top Row */}
                    <div className="flex justify-between items-start">
                      {/* Action Buttons (Top Right) */}
                      <div className="flex flex-col gap-2 ml-auto">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 rounded-md bg-white hover:bg-white/90 shadow-sm"
                        >
                          <Heart className="w-4 h-4 text-gray-700 hover:text-red-500 hover:fill-red-500 transition-colors" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 rounded-md bg-white hover:bg-white/90 shadow-sm"
                        >
                          <Bookmark className="w-4 h-4 text-gray-700" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 rounded-md bg-white hover:bg-white/90 shadow-sm"
                        >
                          <Share2 className="w-4 h-4 text-gray-700" />
                        </Button>
                      </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-linear-to-t from-black/80 via-black/40 to-transparent">
                      <h3 className="text-white font-bold text-sm md:text-base mb-1 truncate">
                        {item.title}
                      </h3>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/user/${item.user.id}`}
                            className="flex items-center gap-2 group-hover/author:opacity-80 transition-opacity"
                          >
                            <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden relative border border-white/50">
                              {/* Simulated Avatar */}
                              <Image
                                src={item.user.image || "/placeholder-user.jpg"}
                                fill
                                alt="avatar"
                              />
                            </div>
                            <span className="text-white/90 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px]">
                              {item.user.name}
                            </span>
                          </Link>
                        </div>

                        <div className="flex items-center gap-1 text-white/90">
                          <Heart className="w-3 h-3 fill-white" />
                          <span className="text-xs font-semibold">
                            {item.totalLikes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      <StockDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        stock={selectedStock}
        onStockSelect={setSelectedStock}
      />
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
