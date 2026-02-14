"use client";

import ItemCard from "@/components/explore/item-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  Filter,
  LayoutGrid,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

// Placeholder Blur Data URL
const blurDataURL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8f/78fwAI0MN5q9372wAAAABJRU5ErkJggg==";

const DUMMY_ITEMS = [
  {
    id: 1,
    title: "Easter Bunny",
    author: "Happy Hop",
    likes: 124,
    isPremium: false,
    width: 600,
    height: 600,
    image:
      "https://images.unsplash.com/photo-1582298538104-fe2e74c2ed54?q=80&w=600",
  },
  {
    id: 2,
    title: "Colorful Eggs",
    author: "Spring Vibes",
    likes: 89,
    isPremium: true,
    width: 800,
    height: 500,
    image:
      "https://images.unsplash.com/photo-1521199326462-23c2a611c0f1?q=80&w=800",
  },
  {
    id: 3,
    title: "Spring Flowers",
    author: "Nature Lens",
    likes: 210,
    isPremium: false,
    width: 600,
    height: 800,
    image:
      "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?q=80&w=600",
  },
  {
    id: 4,
    title: "Easter Basket",
    author: "Crafty Hands",
    likes: 45,
    isPremium: true,
    width: 800,
    height: 600,
    image:
      "https://images.unsplash.com/photo-1617112836237-7f938c538a8e?q=80&w=800",
  },
  {
    id: 5,
    title: "Abstract pastel",
    author: "Artistic Mind",
    likes: 150,
    isPremium: false,
    width: 800,
    height: 800,
    image:
      "https://images.unsplash.com/photo-1516054719050-88cb86dca34a?q=80&w=800",
  },
  {
    id: 6,
    title: "Golden Egg",
    author: "Luxury Design",
    likes: 300,
    isPremium: true,
    width: 600,
    height: 400,
    image:
      "https://images.unsplash.com/photo-1588107779774-0f2b34a95513?q=80&w=600",
  },
  {
    id: 7,
    title: "Minimalist Rabbit",
    author: "Modern Art",
    likes: 76,
    isPremium: false,
    width: 600,
    height: 900,
    image:
      "https://images.unsplash.com/photo-1585255318859-f5c15f4cffe9?q=80&w=600",
  },
  {
    id: 8,
    title: "Celebration",
    author: "Party Time",
    likes: 112,
    isPremium: false,
    width: 800,
    height: 533,
    image:
      "https://images.unsplash.com/photo-1527553198031-1807d9b56363?q=80&w=800",
  },
   {
    id: 9,
    title: "Decorated Room",
    author: "Home Style",
    likes: 22,
    isPremium: true,
    width: 800,
    height: 600,
    image:
      "https://images.unsplash.com/photo-1549497557-d54e61013401?q=80&w=800",
  },
  {
    id: 10,
    title: "Tulips Field",
    author: "Flower Power",
    likes: 560,
    isPremium: false,
    width: 800,
    height: 400,
    image:
      "https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=800",
  },
  {
    id: 11,
    title: "Chicks",
    author: "Cute Animals",
    likes: 198,
    isPremium: false,
    width: 600,
    height: 600,
    image:
      "https://images.unsplash.com/photo-1456574932371-33121516ab14?q=80&w=600",
  },
  {
    id: 12,
    title: "Pattern Background",
    author: "Vector Master",
    likes: 95,
    isPremium: true,
    width: 600,
    height: 800,
    image:
      "https://images.unsplash.com/photo-1574625756784-250875e5330a?q=80&w=600",
  },
];

const FILTER_CHIPS = [
  { label: "License", hasDropdown: true },
  { label: "AI-generated", hasDropdown: true },
  { label: "Orientation", hasDropdown: true },
  { label: "Color", hasDropdown: true },
  { label: "People", hasDropdown: true },
  { label: "File type", hasDropdown: true },
  { label: "Style", hasDropdown: true },
  { label: "Advanced", hasDropdown: true, icon: Settings },
];

const ExploreCategoryPage = () => {
  const params = useParams();
  const category = (params.category as string) || "vectors";
  const formattedCategory = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="container mx-auto px-4 lg:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          {formattedCategory} Vectors
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden md:inline-block">
            Sort by:
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 font-normal">
                Relevance <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Relevance</DropdownMenuItem>
              <DropdownMenuItem>Newest</DropdownMenuItem>
              <DropdownMenuItem>Trending</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center overflow-x-auto no-scrollbar pb-2 md:pb-0">
        {/* Mobile View Filters */}
        <div className="flex md:hidden items-center gap-2 w-full">
           <Button variant="outline" size="sm" className="rounded-full gap-1 flex-1">
            <LayoutGrid className="h-4 w-4" /> Vectors <ChevronDown className="h-3 w-3" />
          </Button>
          <Button variant="secondary" size="sm" className="rounded-full gap-1 flex-1">
             <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
           <Button variant="ghost" size="icon" className="rounded-full shrink-0">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Desktop View Filters */}
        <div className="hidden md:flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="rounded-full gap-1 bg-white">
             <LayoutGrid className="h-4 w-4" /> Vectors <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-1" />
          {FILTER_CHIPS.map((chip) => (
            <Button
              key={chip.label}
              variant="ghost"
              size="sm"
              className="rounded-full bg-muted/40 hover:bg-muted gap-1 text-muted-foreground hover:text-foreground font-normal transition-colors"
            >
              {chip.icon && <chip.icon className="h-4 w-4 mr-1" />}
              {chip.label}
              {chip.hasDropdown && <ChevronDown className="h-3 w-3 opacity-50" />}
            </Button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {DUMMY_ITEMS.map((item) => (
          <div key={item.id} className="break-inside-avoid">
             {/* 
                We use aspect-ratio trick or just natural height. 
                ItemCard uses next/image with width/height, so it should preserve ratio.
             */}
            <ItemCard 
               item={{
                   ...item,
                   // Passing explicit width/height to ItemCard to render correct aspect ratio
                   width: item.width,
                   height: item.height
               }} 
            />
          </div>
        ))}
      </div>
       
       <div className="flex justify-center pt-8 pb-4">
             <Button variant="outline" className="rounded-full px-8">Load more</Button>
       </div>
    </div>
  );
};

export default ExploreCategoryPage;
