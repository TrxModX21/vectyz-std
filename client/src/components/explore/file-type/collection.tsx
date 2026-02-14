"use client";

import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import Image from "next/image";

// Placeholder Blur Data URL
const blurDataURL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8f/78fwAI0MN5q9372wAAAABJRU5ErkJggg==";

const COLLECTIONS = [
  {
    id: 1,
    title: "3D Vector Views",
    resources: 118,
    images: [
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800",
      "https://images.unsplash.com/photo-1614850523060-8da1d56ae167?q=80&w=800",
    ],
  },
  {
    id: 2,
    title: "Character design",
    resources: 115,
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800",
    ],
  },
  {
    id: 3,
    title: "Top vector backgrounds",
    resources: 87,
    images: [
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800",
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800",
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=800",
    ],
  },
  {
    id: 4,
    title: "Colorful vectors",
    resources: 80,
    images: [
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800",
    ],
  },
];

const CollectionItem = ({ item }: { item: (typeof COLLECTIONS)[0] }) => {
  return (
    <div className="flex flex-col gap-3 group cursor-pointer w-[80vw] md:w-auto flex-none snap-center">
      {/* Image Collage Container */}
      <div className="relative rounded-xl overflow-hidden aspect-square grid grid-cols-2 gap-[2px]">
        {/* Left Big Image */}
        <div className="relative h-full">
          <Image
            src={item.images[0]}
            alt={item.title}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={blurDataURL}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Right Stacked Images */}
        <div className="flex flex-col gap-[2px] h-full">
          <div className="relative flex-1">
            <Image
              src={item.images[1]}
              alt={item.title}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={blurDataURL}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
          <div className="relative flex-1">
            <Image
              src={item.images[2]}
              alt={item.title}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={blurDataURL}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="font-bold text-sm md:text-base leading-none">
            {item.title}
          </h3>
          <p className="text-muted-foreground text-xs md:text-sm">
            {item.resources} resources
          </p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
           <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const Collection = () => {
  return (
    <section className="container mx-auto px-4 lg:px-6 py-8 md:py-12 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">
            The inspiration gallery
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Explore curated collections and discover images, moods, and styles
            to ignite your creativity
          </p>
        </div>
        <Button
          variant="secondary"
          className="rounded-full bg-muted/50 hover:bg-muted text-sm font-medium px-6 hidden md:flex"
        >
          Explore collections
        </Button>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-4 gap-4">
        {COLLECTIONS.map((item) => (
          <CollectionItem key={item.id} item={item} />
        ))}
      </div>

       {/* Mobile Scroll Layout */}
      <div className="md:hidden flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
         {COLLECTIONS.map((item) => (
          <CollectionItem key={item.id} item={item} />
        ))}
      </div>
       
       <Button
          variant="secondary"
          className="w-full rounded-full bg-muted/50 hover:bg-muted text-sm font-medium md:hidden mt-4"
        >
          Explore collections
        </Button>
    </section>
  );
};

export default Collection;
