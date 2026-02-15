"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, Crown, Heart, Share2 } from "lucide-react";
import Image from "next/image";

// Placeholder Blur Data URL
const blurDataURL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8f/78fwAI0MN5q9372wAAAABJRU5ErkJggg==";

interface ItemCardProps {
  item: {
    id: number | string;
    title: string;
    image: string;
    isPremium?: boolean;
    author?: string;
    likes?: number | any[];
    width?: number; // Optional width for aspect ratio calculation if needed
    height?: number; // Optional height
  };
  className?: string;
}

const ItemCard = ({ item, className }: ItemCardProps) => {
  return (
    <div className={`relative group rounded-xl overflow-hidden bg-gray-100 ${className}`}>
      {/* 
        Using simple Image with responsive filling style constraints for Masonry.
        In a columns layout, we just need the image to render with intrinsic height.
        However, next/image requires width/height or 'fill'.
        For true masonry with next/image, we usually know aspect ratio or use 'width: 100%, height: auto' style on an <img> tag or a wrapper.
        Let's try using a wrapper with `relative` and let properties control it,
        but for Masonry `columns-`, elements display inline-block.
        A reliable way is using `width={800} height={600}` (or actual dims) and `className="w-full h-auto"`.
      */}
      <Image
        src={item.image}
        alt={item.title}
        width={800}
        height={600} // Placeholder aspect ratio, in real app would come from data
        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
        placeholder="blur"
        blurDataURL={blurDataURL}
        sizes="(max-width: 768px) 50vw, 25vw"
      />

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

      {/* Premium Badge */}
      <div className="absolute top-2 left-2 z-20">
        {item.isPremium && (
          <div className="bg-gray-600/80 backdrop-blur-sm p-1.5 rounded-md text-orange-400">
            <Crown className="w-4 h-4 fill-orange-400" />
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 md:p-4 z-10">
        {/* Top Row: Actions */}
        <div className="flex justify-between items-start">
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

        {/* Bottom Row: Info */}
        <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-linear-to-t from-black/80 via-black/40 to-transparent">
          <h3 className="text-white font-bold text-sm md:text-base mb-1 truncate">
            {item.title}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden relative border border-white/50">
                <Image src="/hero-bg.jpg" fill alt="avatar" />
              </div>
              <span className="text-white/90 text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[100px]">
                {item.author}
              </span>
            </div>

            <div className="flex items-center gap-1 text-white/90">
              <Heart className="w-3 h-3 fill-white" />
              <span className="text-xs font-semibold">
                {typeof item.likes === "number"
                  ? item.likes
                  : Array.isArray(item.likes)
                  ? item.likes.length
                  : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
