"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bookmark, Crown, Eye, Heart, Share2 } from "lucide-react";

import { blurDataURL } from "@/lib/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LikeStock from "@/components/common/like-stock";
import AddToCollectionButton from "@/components/common/add-to-collection-button";
import { ShareDialog } from "@/components/common/share-dialog";

export interface StockCardProps {
  stock: Stock;
  /** Custom wrapper style object (e.g. for flex-basis) */
  style?: React.CSSProperties;
  /** Custom class for the Card element (e.g. break-inside-avoid, col-span) */
  className?: string;
  /** Whether to use Next.js Image filled prop. If false, it calculates width/height from the actual file original size. */
  useFill?: boolean;
  /** Aspect ratio calculated manually (useful if using useFill but needs sizes param) */
  aspectRatio?: number;
  /** Manually provided preview url, if not provided will be dynamically accessed */
  previewUrl?: string;
  /** Use internal padding and borderRadius (landing page style) */
  useImagePadding?: boolean;
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
}

const StockCard = ({
  stock,
  style,
  className = "",
  useFill = true,
  aspectRatio,
  previewUrl,
  useImagePadding = false,
  objectFit = "contain",
}: StockCardProps) => {
  const router = useRouter();

  const preview =
    previewUrl ||
    stock?.files?.find((f) => f.purpose === "PREVIEW")?.url ||
    "/placeholder.jpg";
  const originalFile = stock?.files?.find((f) => f.purpose === "ORIGINAL");
  const previewFile = stock?.files?.find((f) => f.purpose === "PREVIEW");

  const imageWidth = originalFile?.width || previewFile?.width || 800;
  const imageHeight = originalFile?.height || previewFile?.height || 600;

  return (
    <Card
      className={`rounded-2xl bg-gray-200 py-2 overflow-hidden relative group ${className}`}
      style={style}
    >
      <CardContent className="px-2 h-full w-full">
        <div className="relative rounded-xl bg-gray-100 overflow-hidden w-full h-full">
          {useFill ? (
            <Image
              src={preview}
              alt={stock.title}
              fill
              className={`transition-transform duration-500 group-hover:scale-105 ${
                useImagePadding ? "p-2" : ""
              }`}
              style={
                useImagePadding
                  ? { borderRadius: 20, objectFit }
                  : { objectFit }
              }
              placeholder="blur"
              blurDataURL={blurDataURL}
              sizes={
                aspectRatio
                  ? `${Math.round(aspectRatio * 270)}px`
                  : "(max-width: 768px) 100vw, 50vw"
              }
              onClick={() => router.push(`/stock/${stock.slug}`)}
            />
          ) : (
            <Image
              src={preview}
              alt={stock.title}
              width={imageWidth}
              height={imageHeight}
              className="pointer-events-auto w-full h-auto min-h-28 size-full transition-transform duration-500 group-hover:scale-105"
              placeholder="blur"
              blurDataURL={blurDataURL}
              sizes="(max-width: 768px) 50vw, 25vw"
              onClick={() => router.push(`/stock/${stock.slug}`)}
            />
          )}

          {/* Non-fill specific overlay block */}
          {!useFill && (
            <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10" />
          )}
          {useFill && !useImagePadding && (
            <div className="pointer-events-none absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300 z-10" />
          )}

          {/* Premium Badge */}
          <div className="absolute top-2 left-2 z-20">
            {stock.isPremium && (
              <div className="bg-gray-600/80 backdrop-blur-sm p-1.5 rounded-md text-orange-400">
                <Crown className="w-4 h-4 fill-orange-400" />
              </div>
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute pointer-events-none inset-0 bg-black/10 lg:bg-black-20 opacity-100 lg:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 md:p-4 z-10">
            {/* Top Row: Actions */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2 ml-auto">
                <LikeStock
                  stock={stock}
                  useCounter={false}
                  variant="ghost"
                  showHoverCard={false}
                  className="pointer-events-auto h-8 w-8 rounded-md bg-white hover:bg-white/90 shadow-sm cursor-pointer justify-center"
                />

                <AddToCollectionButton stock={stock}>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="pointer-events-auto h-8 w-8 rounded-md bg-white hover:bg-white/90 shadow-sm cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4 text-gray-700" />
                  </Button>
                </AddToCollectionButton>

                <ShareDialog
                  url={
                    typeof window !== "undefined"
                      ? `${window.location.origin}/stock/${stock.slug}`
                      : ""
                  }
                  title={`Share ${stock.title}`}
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
              <h3
                className="pointer-events-auto text-white font-bold text-sm md:text-base mb-1 truncate cursor-pointer"
                onClick={() => router.push(`/stock/${stock.slug}`)}
              >
                {stock.title}
              </h3>

              <div className="flex items-center justify-between">
                <div
                  className="pointer-events-auto flex items-center gap-2 group-hover/author:opacity-80 transition-opacity cursor-pointer"
                  onClick={() => router.push(`/profile/${stock.user.username}`)}
                >
                  <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden relative border border-white/50">
                    <Image
                      src={stock.user.image || "/placeholder.jpg"}
                      fill
                      alt="avatar"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-white/90 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px]">
                    {stock.user.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-white/90">
                    <Heart className="w-3 h-3 fill-white" />
                    <span className="text-xs font-semibold">
                      {stock.totalLikes}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-white/90">
                    <Eye className="w-3 h-3 fill-white" />
                    <span className="text-xs font-semibold">
                      {typeof stock.totalViews === "number"
                        ? stock.totalViews
                        : Array.isArray(stock.totalViews)
                          ? stock.totalViews
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
};

export default StockCard;
