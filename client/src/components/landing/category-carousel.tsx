"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import IconReader from "../common/icon-reader";
import { useGetCategories } from "@/hooks/use-categories";
import Link from "next/link";

const CategoryCarousel = () => {
  const { data, isLoading } = useGetCategories();

  if (isLoading) {
    return <CategoryCarouselSkeleton />;
  }

  const categories = data?.categories || [];

  return (
    <div className="max-w-6xl mx-auto px-4">
      <Carousel>
        <CarouselContent>
          {categories.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-1/2 md:basis-1/3 xl:basis-1/6 flex flex-col items-center gap-4 group cursor-pointer"
            >
              <Link
                href={`/explore/search?categoryId=${item.id}`}
                className="flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl text-gray-600 group-hover:text-blue-600 transition-colors">
                  <IconReader name={item.icon || "no-icon"} />
                </div>
                <span className="text-gray-600 text-sm text-center md:text-lg font-medium group-hover:text-blue-600 transition-colors">
                  {item.name}
                </span>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;

function CategoryCarouselSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <Carousel>
        <CarouselContent>
          {Array.from({ length: 6 }).map((_, i) => (
            <CarouselItem
              key={i}
              className="basis-1/2 md:basis-1/3 xl:basis-1/6 flex flex-col items-center gap-4"
            >
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <Skeleton className="h-4 w-24" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
