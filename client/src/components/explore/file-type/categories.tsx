"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// Placeholder Blur Data URL
const blurDataURL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8f/78fwAI0MN5q9372wAAAABJRU5ErkJggg==";

const CATEGORY_TAGS = ["Events", "Education", "Nature", "Others"];

const PREDEFINED_CATEGORIES: Record<
  string,
  { id: number; title: string; image: string }[]
> = {
  Events: [
    {
      id: 1,
      title: "Christmas vectors",
      image:
        "https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=800",
    },
    {
      id: 2,
      title: "Halloween vectors",
      image:
        "https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?q=80&w=800",
    },
    {
      id: 3,
      title: "Easter vectors",
      image:
        "https://images.unsplash.com/photo-1522008629172-0c17498c8a14?q=80&w=800",
    },
    {
      id: 4,
      title: "Fall vectors",
      image:
        "https://images.unsplash.com/photo-1508264972745-b46be4840d2f?q=80&w=800",
    },
    {
      id: 5,
      title: "Spring vectors",
      image:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800",
    },
    {
      id: 6,
      title: "Summer vectors",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
    },
    {
      id: 7,
      title: "Happy New Year vectors",
      image:
        "https://images.unsplash.com/photo-1546272362-d2789f6df844?q=80&w=800",
    },
    {
      id: 8,
      title: "Winter vectors",
      image:
        "https://images.unsplash.com/photo-1483323326296-c67d7a8e2171?q=80&w=800",
    },
    {
      id: 9,
      title: "Mother's Day",
      image:
        "https://images.unsplash.com/photo-1494451930944-8998635c2123?q=80&w=800",
    },
    {
      id: 10,
      title: "Party masks",
      image:
        "https://images.unsplash.com/photo-1520038410233-7141dd7e6f97?q=80&w=800",
    },
    {
      id: 11,
      title: "Father's Day",
      image:
        "https://images.unsplash.com/photo-1525381559850-891d1796d8ea?q=80&w=800",
    },
    {
      id: 12,
      title: "Valentine's Day",
      image:
        "https://images.unsplash.com/photo-1518199266791-5375a83190b2?q=80&w=800",
    },
  ],
  Education: [
    {
      id: 1,
      title: "School vectors",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800",
    },
    {
      id: 2,
      title: "Book covers",
      image:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800",
    },
    {
      id: 3,
      title: "Classroom",
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800",
    },
    {
      id: 4,
      title: "Graduation",
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800",
    },
  ],
  Nature: [
    {
      id: 1,
      title: "Forest",
      image:
        "https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=800",
    },
    {
      id: 2,
      title: "Flowers",
      image:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800",
    },
    {
      id: 3,
      title: "Ocean",
      image:
        "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=800",
    },
    {
      id: 4,
      title: "Animals",
      image:
        "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=800",
    },
  ],
  Others: [
    {
      id: 1,
      title: "Abstract",
      image:
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800",
    },
    {
      id: 2,
      title: "Technology",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800",
    },
    {
      id: 3,
      title: "Business",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800",
    },
    {
      id: 4,
      title: "Food",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800",
    },
  ],
};

const Categories = () => {
  const params = useParams();

  const [activeTag, setActiveTag] = useState("Events");
  const categories = PREDEFINED_CATEGORIES[activeTag] || [];

  return (
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

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {CATEGORY_TAGS.map((tag) => (
            <Button
              key={tag}
              onClick={() => setActiveTag(tag)}
              variant={activeTag === tag ? "default" : "outline"}
              className={cn(
                "rounded-full px-6 transition-all duration-300",
                activeTag === tag
                  ? "bg-primary text-background hover:bg-foreground/90"
                  : "bg-transparent hover:bg-muted",
              )}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="hidden md:grid md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            href={`/explore/${params.filetype}/category-slug`}
            key={category.id}
            className="relative group overflow-hidden rounded-xl aspect-video cursor-pointer"
          >
            <Image
              src={category.image}
              alt={category.title}
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
                {category.title}
              </h3>
              <ArrowRight className="rounded-full bg-black/40 size-8 text-v-green" />
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile Scroll Layout */}
      <div className="md:hidden flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
        {categories.map((category) => (
          <Link
            href={`/explore/`}
            key={category.id}
            className="relative flex-none w-[80vw] aspect-video rounded-xl overflow-hidden snap-center"
          >
            <Image
              src={category.image}
              alt={category.title}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={blurDataURL}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 z-10">
              <h3 className="text-white font-bold text-lg drop-shadow-md">
                {category.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
