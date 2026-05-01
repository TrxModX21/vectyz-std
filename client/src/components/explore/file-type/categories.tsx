"use client";

import SectionSeparator from "@/components/common/section-separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategoriesFromFiletype } from "@/hooks/use-categories";
import { blurDataURL } from "@/lib/helpers";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const Categories = () => {
  const params = useParams();

  const { data: categoriesResponseData, isLoading } =
    useGetCategoriesFromFiletype(params.filetype as string);

  const categories = categoriesResponseData?.categories || [];

  if (!isLoading && categories.length === 0) {
    return null;
  }

  return isLoading ? (
    <CategorySectionSkeleton />
  ) : (
    <>
      <SectionSeparator />

      <section className="container mx-auto px-4 lg:px-6 py-8 md:py-12 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl md:text-3xl font-bold">
              Need vector design ideas? Start here
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Discover the most searched vector themes and find yours
            </p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              href={`/explore/search?fileType=${params.filetype}&category=${category.slug}`}
              key={category.id}
              className="relative group overflow-hidden rounded-xl aspect-video cursor-pointer"
            >
              <Image
                src={category?.image || "/placeholder.jpg"}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                placeholder="blur"
                blurDataURL={blurDataURL}
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80 transition-opacity duration-300" />

              {/* Dark Hover Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute flex justify-between w-[90%] items-center bottom-4 left-4 z-10">
                <h3 className="text-white font-bold text-lg drop-shadow-md">
                  {category.name}
                </h3>
                <ArrowRight className="rounded-full bg-black/40 size-8 text-v-green" />
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Scroll Layout */}
        <div className="lg:hidden flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
          {categories.map((category) => (
            <Link
              href={`/explore/`}
              key={category.id}
              className="relative flex-none w-[80vw] aspect-video rounded-xl overflow-hidden snap-center"
            >
              <Image
                src={category.image || "/placeholder.jpg"}
                alt={category.name}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={blurDataURL}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 z-10">
                <h3 className="text-white font-bold text-lg drop-shadow-md">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

function CategorySectionSkeleton() {
  return (
    <section className="container mx-auto px-4 lg:px-6 py-8 md:py-12 space-y-6">
      {/* Heading */}
      <div className="space-y-4">
        <div className="space-y-2 text-center">
          <Skeleton className="h-8 w-80 mx-auto" />
          <Skeleton className="h-4 w-72 mx-auto" />
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl aspect-video"
          >
            <Skeleton className="absolute inset-0 rounded-xl" />

            {/* bottom text */}
            <div className="absolute bottom-4 left-4 space-y-2">
              <Skeleton className="h-5 w-28 bg-white/30" />
            </div>

            {/* arrow skeleton */}
            <div className="absolute bottom-4 right-4">
              <Skeleton className="h-8 w-8 rounded-full bg-white/30" />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Scroll */}
      <div className="md:hidden flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="relative flex-none w-[80vw] aspect-video rounded-xl overflow-hidden snap-center"
          >
            <Skeleton className="absolute inset-0 rounded-xl" />

            <div className="absolute bottom-4 left-4">
              <Skeleton className="h-5 w-32 bg-white/30" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;
