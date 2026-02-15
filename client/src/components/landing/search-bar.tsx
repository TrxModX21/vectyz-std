"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SelectWithSearching from "../select-with-searching";
import { useState } from "react";
import { useGetCategories } from "@/hooks/use-categories";
import { useRouter } from "next/navigation";

const LandingSearchBar = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useGetCategories();
  const router = useRouter();

  const categories = data?.categories || [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (selectedCategory) params.append("categoryId", selectedCategory);

    router.push(`/explore/search?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-full p-2 flex items-center shadow-lg w-full">
        {/* Dropdown Trigger */}
        <SelectWithSearching<Category>
          items={categories}
          value={selectedCategory}
          onValueChange={(val) => setSelectedCategory(val)}
          getLabel={(c) => c.name}
          getValue={(c) => c.id.toString()}
          placeholder="Select category"
          searchPlaceholder="Search category..."
          disabled={isLoading}
          className="h-10 md:h-12 px-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold flex items-center gap-2 mr-2 shrink-0"
        />

        {/* Input Field */}
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search vectors..."
            className="border-0 shadow-none focus-visible:ring-0 text-base h-10 md:h-12 placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Search Icon */}
        <div className="pr-2 cursor-pointer" onClick={handleSearch}>
          <Search className="text-gray-400 h-6 w-6 hover:text-blue-600 transition-colors" />
        </div>
      </div>

      {/* Popular Tags */}
      <div className="flex w-[70%] lg:w-full md:w-auto items-center justify-start md:justify-center gap-2 mt-4 text-sm text-white/80 pb-2 md:pb-0 mx-auto">
        <span className="font-medium shrink-0 sticky left-0 bg-black/40 px-3 py-0.5 rounded-full md:static md:bg-black/20 z-10">
          Popular:
        </span>

        <div className="flex overflow-x-auto md:overflow-visible no-scrollbar gap-2">
          {["Vectors", "Background", "Id Cards", "Business"].map((tag) => (
            <span
              key={tag}
              onClick={() => router.push(`/explore/search?search=${tag}`)}
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full cursor-pointer transition-colors backdrop-blur-sm shrink-0"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingSearchBar;
