import { blurDataURL } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Bookmark, Crown, Eye, Heart, Share2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LikeStock from "./like-stock";
import AddToCollectionButton from "./add-to-collection-button";
import { Button } from "../ui/button";
import { ShareDialog } from "./share-dialog";

export interface StockCardProps {
  stock: Stock;
  /** Custom wrapper style object (e.g. for flex-basis) */
  style?: React.CSSProperties;
  /** Custom class for the Card element (e.g. break-inside-avoid, col-span) */
  className?: string;
  /** Manually provided preview url, if not provided will be dynamically accessed */
  previewUrl?: string;
  /** Custom action button (e.g. Trash button for quick removal in collections) */
  customAction?: React.ReactNode;
}

const StockCard = ({
  stock,
  className,
  previewUrl,
  style,
  customAction,
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
    <div
      className={cn(
        "relative rounded-2xl group bg-gray-100 overflow-hidden w-full h-full",
        className,
      )}
      style={style}
    >
      <Image
        src={preview}
        alt={stock.title}
        width={imageWidth}
        height={imageHeight}
        className="pointer-events-auto w-full h-auto min-h-28 size-full transition-transform duration-500"
        placeholder="blur"
        blurDataURL={blurDataURL}
        onClick={() => router.push(`/stock/${stock.slug}`)}
      />

      {/* Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10" />

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
            
            {customAction}

            <ShareDialog
              url={
                typeof window !== "undefined"
                  ? `${window.location.origin}/stock/${stock.slug}`
                  : ""
              }
              title={`Share ${stock.title}`}
              media={previewFile?.url || ""}
              description={stock?.description}
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
  );
};

export default StockCard;
