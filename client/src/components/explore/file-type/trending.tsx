"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, Crown, Eye, Heart, Share2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { blurDataURL } from "@/lib/helpers";
import { useGetTrendingStocks } from "@/hooks/use-stock";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/common/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import LikeStock from "@/components/common/like-stock";
import AddToCollectionButton from "@/components/common/add-to-collection-button";
import { ShareDialog } from "@/components/common/share-dialog";

const Trending = () => {
  const router = useRouter();
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
            <Card className="rounded-2xl bg-gray-200 py-2 col-span-1 md:col-span-2 md:row-span-2 hidden md:block">
              <CardContent className="relative w-full h-full px-2">
                <div className="relative w-full h-full group overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={
                      stocks[0]?.files.find((f) => f.purpose === "PREVIEW")
                        ?.url || "/placeholder.jpg"
                    }
                    alt={stocks[0]?.title}
                    fill
                    className="pointer-events-auto w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onClick={() => router.push(`/stock/${stocks[0].slug}`)}
                  />

                  <div className="pointer-events-none absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300 z-10" />

                  <div className="absolute top-2 left-2">
                    {stocks[0]?.isPremium && (
                      <div className="bg-gray-600/80 backdrop-blur-sm p-1.5 rounded-md text-orange-400">
                        <Crown className="w-4 h-4 fill-orange-400" />
                      </div>
                    )}
                  </div>

                  <div className="pointer-events-none absolute inset-0 bg-black/10 lg:bg-black-20 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 md:p-4">
                    {/* Top Row */}
                    <div className="flex justify-between items-start">
                      {/* Action Buttons (Top Right) */}
                      <div className="flex flex-col gap-2 ml-auto">
                        <LikeStock
                          stock={stocks[0]}
                          useCounter={false}
                          variant="ghost"
                          showHoverCard={false}
                          className="pointer-events-auto h-8 w-8 rounded-md bg-white hover:bg-white/90 shadow-sm cursor-pointer justify-center"
                        />

                        <AddToCollectionButton stock={stocks[0]}>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="pointer-events-auto h-8 w-8 rounded-md bg-white hover:bg-white/90 shadow-sm"
                          >
                            <Bookmark className="w-4 h-4 text-gray-700" />
                          </Button>
                        </AddToCollectionButton>

                        <ShareDialog
                          url={`${window.location.origin}/stock/${stocks[0].slug}`}
                          title={`Share ${stocks[0].title}`}
                        >
                          <Button
                            size="icon"
                            variant="secondary"
                            className="pointer-events-auto h-8 w-8 rounded-md bg-white hover:bg-white/90 shadow-sm"
                          >
                            <Share2 className="w-4 h-4 text-gray-700" />
                          </Button>
                        </ShareDialog>
                      </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-linear-to-t from-black/80 via-black/40 to-transparent">
                      <h3 className="text-white font-bold text-sm md:text-lg mb-1 truncate">
                        {stocks[0]?.title}
                      </h3>

                      <div className="flex items-center justify-between">
                        <div
                          className="pointer-events-auto flex items-center gap-2 cursor-pointer"
                          onClick={() =>
                            router.push(`/profile/${stocks[0].user.username}`)
                          }
                        >
                          <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden relative border border-white/50">
                            <Image
                              src={stocks[0].user.image || "/placeholder.jpg"}
                              fill
                              alt="avatar"
                            />
                          </div>
                          <span className="text-white/90 text-xs md:text-base font-medium">
                            {stocks[0]?.user.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-white/90">
                            <Heart className="w-3 h-3 fill-white" />
                            <span className="text-xs font-semibold">
                              {stocks[0].totalLikes}
                            </span>
                          </div>

                          <div className="flex items-center justify-center gap-1 text-white/90">
                            <Eye className="w-3 h-3 fill-white" />
                            <span className="text-xs font-semibold">
                              {typeof stocks[0].totalViews === "number"
                                ? stocks[0].totalViews
                                : Array.isArray(stocks[0].totalViews)
                                  ? stocks[0].totalViews
                                  : 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Desktop: Remaining Items (1-8) */}
            {stocks.slice(1).map((item) => {
              const preview = item.files.find(
                (f) => f.purpose === "PREVIEW",
              )?.url;

              return (
                <Card
                  key={item.id}
                  className="hidden md:block rounded-2xl bg-gray-200 py-2"
                >
                  <CardContent className="relative w-full h-full px-2">
                    <div className="relative w-full h-full group overflow-hidden col-span-1 row-span-1 bg-gray-100 rounded-xl">
                      <Image
                        src={preview || "/placeholder.jpg"}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        placeholder="blur"
                        blurDataURL={blurDataURL}
                        sizes="(max-width: 768px) 100vw, 25vw"
                        onClick={() => router.push(`/stock/${item.slug}`)}
                      />

                      <div className="pointer-events-none absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />

                      <div className="absolute top-2 left-2">
                        {item.isPremium && (
                          <div className="bg-gray-600/80 backdrop-blur-sm p-1.5 rounded-md text-orange-400">
                            <Crown className="w-4 h-4 fill-orange-400" />
                          </div>
                        )}
                      </div>

                      <div className="pointer-events-none absolute inset-0 bg-black/10 lg:bg-black-20 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 md:p-4">
                        {/* Top Row */}
                        <div className="flex justify-between items-start">
                          {/* Action Buttons (Top Right) */}
                          <div className="flex flex-col gap-2 ml-auto">
                            <LikeStock
                              stock={item}
                              useCounter={false}
                              variant="ghost"
                              showHoverCard={false}
                              className="pointer-events-auto h-8 w-8 rounded-md bg-white hover:bg-white/90 shadow-sm cursor-pointer justify-center"
                            />

                            <AddToCollectionButton stock={item}>
                              <Button
                                size="icon"
                                variant="secondary"
                                className="pointer-events-auto  h-8 w-8 rounded-md bg-white hover:bg-white/90 shadow-sm"
                              >
                                <Bookmark className="w-4 h-4 text-gray-700" />
                              </Button>
                            </AddToCollectionButton>

                            <ShareDialog
                              url={`${window.location.origin}/stock/${item.slug}`}
                              title={`Share ${item.title}`}
                            >
                              <Button
                                size="icon"
                                variant="secondary"
                                className="pointer-events-auto  h-8 w-8 rounded-md bg-white hover:bg-white/90 shadow-sm"
                              >
                                <Share2 className="w-4 h-4 text-gray-700" />
                              </Button>
                            </ShareDialog>
                          </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-linear-to-t from-black/80 via-black/40 to-transparent">
                          <h3 className="text-white font-bold text-sm md:text-base mb-1 truncate">
                            {item.title}
                          </h3>

                          <div className="flex items-center justify-between">
                            <div
                              className="pointer-events-auto flex items-center gap-2 cursor-pointer"
                              onClick={() =>
                                router.push(`/profile/${item.user.username}`)
                              }
                            >
                              <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden relative border border-white/50">
                                {/* Simulated Avatar */}
                                <Image
                                  src={item.user.image || "/placeholder.jpg"}
                                  fill
                                  alt="avatar"
                                />
                              </div>
                              <span className="text-white/90 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px]">
                                {item.user.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-white/90">
                                <Heart className="w-3 h-3 fill-white" />
                                <span className="text-xs font-semibold">
                                  {item.totalLikes}
                                </span>
                              </div>

                              <div className="flex items-center justify-center gap-1 text-white/90">
                                <Eye className="w-3 h-3 fill-white" />
                                <span className="text-xs font-semibold">
                                  {typeof item.totalViews === "number"
                                    ? item.totalViews
                                    : Array.isArray(item.totalViews)
                                      ? item.totalViews
                                      : 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Mobile: Horizontal Scroll View */}
            <div className="md:hidden flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory col-span-1 h-[300px]">
              {stocks.map((item) => {
                const preview = item.files.find(
                  (f) => f.purpose === "PREVIEW",
                )?.url;

                return (
                  <Card
                    key={item.id}
                    className="relative flex-none w-[85vw] h-full rounded-2xl overflow-hidden snap-center bg-gray-200 py-2"
                  >
                    <CardContent className="relative w-full h-full px-2">
                      <div className="relative w-full h-full rounded-2xl">
                        <Image
                          src={preview || "/placeholder.jpg"}
                          alt={item.title}
                          fill
                          className="object-cover w-full h-auto rounded-2xl"
                          placeholder="blur"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          blurDataURL={blurDataURL}
                          onClick={() => router.push(`/stock/${item.slug}`)}
                        />

                        {/* Premium Badge */}
                        <div className="absolute top-2 left-2 z-20">
                          {item.isPremium && (
                            <div className="bg-gray-600/80 backdrop-blur-sm p-1.5 rounded-md text-orange-400">
                              <Crown className="w-4 h-4 fill-orange-400" />
                            </div>
                          )}
                        </div>

                        {/* Hover Overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-black/10 lg:bg-black-20 opacity-100 lg:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 md:p-4 z-10">
                          {/* Top Row: Actions */}
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-2 ml-auto">
                              <LikeStock
                                stock={item}
                                useCounter={false}
                                variant="ghost"
                                showHoverCard={false}
                                className="pointer-events-auto h-8 w-8 rounded-md bg-white hover:bg-white/90 shadow-sm cursor-pointer justify-center"
                              />

                              <AddToCollectionButton stock={item}>
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  className="pointer-events-auto h-8 w-8 rounded-md bg-white hover:bg-white/90 shadow-sm cursor-pointer"
                                >
                                  <Bookmark className="w-4 h-4 text-gray-700" />
                                </Button>
                              </AddToCollectionButton>

                              <ShareDialog
                                url={`${window.location.origin}/stock/${item.slug}`}
                                title={`Share ${item.title}`}
                              >
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  className="pointer-events-auto h-8 w-8 rounded-md bg-white hover:bg-white/90 shadow-sm cursor-pointer"
                                >
                                  <Share2 className="w-4 h-4 text-gray-700" />
                                </Button>
                              </ShareDialog>
                            </div>
                          </div>

                          {/* Bottom Row: Info */}
                          <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-linear-to-t from-black/80 via-black/40 to-transparent">
                            <h3 className="text-white font-bold text-sm md:text-base mb-1 truncate">
                              {item.title}
                            </h3>

                            <div className="flex items-center justify-between">
                              <div
                                className="pointer-events-auto flex items-center gap-2 cursor-pointer"
                                onClick={() =>
                                  router.push(`/profile/${item.user.username}`)
                                }
                              >
                                <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden relative border border-white/50">
                                  <Image
                                    src={item.user.image || "/placeholder.jpg"}
                                    fill
                                    alt="avatar"
                                  />
                                </div>
                                <span className="text-white/90 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px]">
                                  {item.user.name}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-white/90">
                                  <Heart className="w-3 h-3 fill-white" />
                                  <span className="text-xs font-semibold">
                                    {item.totalLikes}
                                  </span>
                                </div>

                                <div className="flex items-center justify-center gap-1 text-white/90">
                                  <Eye className="w-3 h-3 fill-white" />
                                  <span className="text-xs font-semibold">
                                    {typeof item.totalViews === "number"
                                      ? item.totalViews
                                      : Array.isArray(item.totalViews)
                                        ? item.totalViews
                                        : 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="absolute top-2 left-2">
                          {item.isPremium && (
                            <div className="bg-gray-600/80 backdrop-blur-sm p-1.5 rounded-md text-orange-400">
                              <Crown className="w-4 h-4 fill-orange-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full rounded-full bg-muted/50 hover:bg-muted text-sm font-medium md:hidden mt-20"
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
