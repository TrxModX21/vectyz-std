import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { blurDataURL } from "@/lib/helpers";
import { useRouter } from "next/navigation";
import { Bookmark, Crown, Eye, Heart, Share2 } from "lucide-react";
import LikeStock from "../common/like-stock";
import AddToCollectionButton from "../common/add-to-collection-button";
import { Button } from "../ui/button";
import { ShareDialog } from "../common/share-dialog";

const StockCard = ({
  stock,
  aspectRatio,
  preview,
}: {
  stock: Stock;
  aspectRatio: number;
  preview?: string;
}) => {
  const router = useRouter();

  return (
    <Card
      className="rounded-2xl bg-gray-200 py-2 overflow-hidden relative group"
      style={{
        flexGrow: aspectRatio, // ← kunci utama
        flexBasis: `${aspectRatio * 270}px`, // estimasi lebar awal
        height: "270px",
      }}
    >
      <CardContent className="px-2">
        <div className="rounded-xl bg-gray-100">
          <Image
            src={preview || "/placeholder.jpg"}
            alt={stock.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 p-2"
            style={{ borderRadius: 20 }}
            placeholder="blur"
            blurDataURL={blurDataURL}
            sizes={`${Math.round(aspectRatio * 270)}px`}
            onClick={() => router.push(`/stock/${stock.slug}`)}
          />

          {/* Crown Icon (Top Left) */}
          <div className="absolute top-2 left-2">
            {stock.isPremium && (
              <div className="bg-gray-600/80 backdrop-blur-sm p-1.5 rounded-md text-orange-400">
                <Crown className="w-4 h-4 fill-orange-400" />
              </div>
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute pointer-events-none inset-0 bg-black/10 lg:bg-black-20 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 md:p-4">
            {/* Top Row */}
            <div className="flex justify-between items-start">
              {/* Action Buttons (Top Right) */}
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
                  url={`${window.location.origin}/stock/${stock.slug}`}
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

            {/* Bottom Row */}
            <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-linear-to-t from-black/80 via-black/40 to-transparent">
              <h3
                className="pointer-events-auto text-white font-bold text-sm md:text-base mb-1 truncate cursor-pointer"
                onClick={() => router.push(`/stock/${stock.slug}`)}
              >
                {stock.title}
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="pointer-events-auto flex items-center gap-2 group-hover/author:opacity-80 transition-opacity cursor-pointer"
                    onClick={() =>
                      router.push(`/profile/${stock.user.username}`)
                    }
                  >
                    <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden relative border border-white/50">
                      {/* Simulated Avatar */}
                      <Image
                        src={stock.user.image || "/placeholder.jpg"}
                        fill
                        alt="avatar"
                      />
                    </div>
                    <span className="text-white/90 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px]">
                      {stock.user.name}
                    </span>
                  </div>
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
