import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Crown,
  Download,
  Heart,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRef } from "react";
import { useGetRelatedStock } from "@/hooks/use-stock";
import { blurDataURL } from "@/lib/helpers";
import { useRouter } from "next/navigation";

type Props = { stock?: Stock; isLoading: boolean };

const RelatedStock = ({ stock, isLoading }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const { data: relatedStocks } = useGetRelatedStock(
    isLoading ? "" : stock?.id!,
    10,
  );
  const related = relatedStocks?.stocks || [];

  return (
    <div className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">You might also like</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 shrink-0"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 shrink-0"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {related.map((item) => {
          const relatedPreviewImage = item?.files.find(
            (f) => f.purpose === "PREVIEW",
          );

          return (
            <div
              key={item.id}
              className="w-[200px] sm:w-[240px] md:w-[260px] lg:w-[280px] shrink-0 snap-start"
            >
              <Card className="group overflow-hidden border-0 shadow-none hover:shadow-lg transition-all duration-300">
                <div
                  className="relative rounded-xl overflow-hidden bg-gray-100 flex-auto h-[240px] md:h-[280px] max-w-[380px]"
                  onClick={() => router.push(`/stock/${item.id}`)}
                >
                  <Image
                    src={relatedPreviewImage?.url! || "/placeholder.jpg"}
                    alt={item?.title}
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 min-w-[150px]"
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
                                src={item.user.image || "/placeholder.jpg"}
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
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedStock;
