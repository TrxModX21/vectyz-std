"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, Crown, Heart, Share2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { blurDataURL } from "@/lib/helpers";
import { useGetTrendingStocks } from "@/hooks/use-stock";
import { Skeleton } from "@/components/ui/skeleton";

const TRENDING_ITEMS = [
  {
    id: 1,
    title: "Dragon Illustration",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200",
    isPremium: true,
    author: "Nadasu'i Creative",
    likes: 12,
  },
  {
    id: 2,
    title: "Sunset Beach",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
    isPremium: false,
    author: "Rumah Aceh",
    likes: 85,
  },
  {
    id: 3,
    title: "Carnival Fun",
    image:
      "https://images.unsplash.com/photo-1516900557549-41557d405adf?q=80&w=800",
    isPremium: false,
    author: "Makar Sankranti",
    likes: 24,
  },
  {
    id: 4,
    title: "Leopard Art",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=800",
    isPremium: true,
    author: "Awir Pv",
    likes: 0,
  },
  {
    id: 5,
    title: "Robot Love",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800",
    isPremium: false,
    author: "Nature Lens",
    likes: 45,
  },
  {
    id: 6,
    title: "Paella Dish",
    image:
      "https://images.unsplash.com/photo-1515443961218-a51367888e4b?q=80&w=800",
    isPremium: true,
    author: "Vector Master",
    likes: 67,
  },
  {
    id: 7,
    title: "Cute Animals",
    image:
      "https://images.unsplash.com/photo-1535930749574-1399327ce78f?q=80&w=800",
    isPremium: false,
    author: "Urban Design",
    likes: 33,
  },
  {
    id: 8,
    title: "Japan Art",
    image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800&auto=format&fit=crop",
    isPremium: true,
    author: "Artistic Mind",
    likes: 92,
  },
  {
    id: 9,
    title: "Racing Car",
    image:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800",
    isPremium: true,
    author: "Artistic Mind",
    likes: 92,
  },
];

const Trending = () => {
  const params = useParams();
  const filetype = (params.filetype as string) || "vectors";
  const formattedTitle = filetype
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const { data, isLoading } = useGetTrendingStocks(filetype);
  const stocks = data?.stocks || [];

  if (isLoading) {
    return <TrendingSkeleton />;
  }

  return (
    <section className="container mx-auto px-4 lg:px-6 py-8 md:py-12 space-y-6">
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
        <div className="relative group overflow-hidden rounded-2xl col-span-1 md:col-span-2 md:row-span-2 hidden md:block">
          <Image
            src={
              stocks[0].files.find((f) => f.purpose === "PREVIEW")?.url ||
              "/placeholder.jpg"
            }
            alt={stocks[0].title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            placeholder="blur"
            blurDataURL={blurDataURL}
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />

          <div className="absolute top-2 left-2">
            {stocks[0].isPremium && (
              <div className="bg-gray-600/80 backdrop-blur-sm p-1.5 rounded-md text-orange-400">
                <Crown className="w-4 h-4 fill-orange-400" />
              </div>
            )}
          </div>

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
                {stocks[0].title}
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden relative border border-white/50">
                    {/* Simulated Avatar */}
                    <Image src="/hero-bg.jpg" fill alt="avatar" />
                  </div>
                  <span className="text-white/90 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px]">
                    {stocks[0].user.name}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-white/90">
                  <Heart className="w-3 h-3 fill-white" />
                  <span className="text-xs font-semibold">
                    {stocks[0].totalLikes}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Remaining Items (1-8) */}
        {stocks.slice(1).map((item) => {
          const preview = item.files.find((f) => f.purpose === "PREVIEW")?.url;

          return (
            <div
              key={item.id}
              className="relative group overflow-hidden rounded-2xl col-span-1 row-span-1 hidden md:block"
            >
              <Image
                src={preview || "/placeholder.jpg"}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                placeholder="blur"
                blurDataURL={blurDataURL}
                sizes="(max-width: 768px) 100vw, 25vw"
              />

              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />

              <div className="absolute top-2 left-2">
                {item.isPremium && (
                  <div className="bg-gray-600/80 backdrop-blur-sm p-1.5 rounded-md text-orange-400">
                    <Crown className="w-4 h-4 fill-orange-400" />
                  </div>
                )}
              </div>

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
                      <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden relative border border-white/50">
                        {/* Simulated Avatar */}
                        <Image src="/hero-bg.jpg" fill alt="avatar" />
                      </div>
                      <span className="text-white/90 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px]">
                        {item.user.name}
                      </span>
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

        {/* Mobile: Horizontal Scroll View */}
        <div className="md:hidden flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory col-span-1 h-[300px]">
          {TRENDING_ITEMS.map((item) => (
            <div
              key={item.id}
              className="relative flex-none w-[85vw] h-full rounded-2xl overflow-hidden snap-center"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={blurDataURL}
              />

              <div className="absolute top-2 left-2">
                {item.isPremium && (
                  <div className="bg-gray-600/80 backdrop-blur-sm p-1.5 rounded-md text-orange-400">
                    <Crown className="w-4 h-4 fill-orange-400" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="secondary"
        className="w-full rounded-full bg-muted/50 hover:bg-muted text-sm font-medium md:hidden mt-4"
      >
        Discover free {formattedTitle.toLowerCase()}
      </Button>
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
