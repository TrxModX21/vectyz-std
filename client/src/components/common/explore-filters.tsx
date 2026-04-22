"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronDown,
  LayoutGrid,
  FileBadge,
  ArrowDownUp,
  Search,
  Check,
  SlidersHorizontal,
} from "lucide-react";
import IconReader from "@/components/common/icon-reader";
import { useGetCategoriesFromFiletype } from "@/hooks/use-categories";

export interface ExploreFiltersProps {
  fileTypes: any[];
  categories: any[];
  currentFiletype: string;
  currentCategory: string;
  currentLicense: string;
  currentSort: string;

  /** Handler saat Filetype (Desktop) berubah */
  onFiletypeChange: (slug: string) => void;
  /** Handler saat Category (Desktop) berubah */
  onCategoryChange: (slug: string) => void;
  /** Handler saat License / Sort (Desktop) berubah */
  onSearchParamChange: (key: string, value: string) => void;
  /** Handler saat Apply (Mobile) dipencet */
  onApplyMobileFilters: (
    ft: string,
    cat: string,
    lic: string,
    sort: string,
  ) => void;
}

// --- Subcomponent: Mobile UI Filter Sheet ---
const MobileFilterSheet = ({
  fileTypes,
  currentFiletype,
  currentCategory,
  currentLicense,
  currentSort,
  onApplyMobileFilters,
}: Omit<
  ExploreFiltersProps,
  "categories" | "onFiletypeChange" | "onCategoryChange" | "onSearchParamChange"
>) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tempFT, setTempFT] = useState(currentFiletype);
  const [tempCat, setTempCat] = useState(currentCategory);
  const [tempLic, setTempLic] = useState(currentLicense);
  const [tempSort, setTempSort] = useState(currentSort);
  const [catSearch, setCatSearch] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  

  const handleGlobalSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setOpen(false);
      router.push(
        `/explore/search?search=${encodeURIComponent(globalSearch.trim())}`,
      );
    }
  };

  const { data: catData } = useGetCategoriesFromFiletype(tempFT);
  const categories = Array.isArray(catData)
    ? catData
    : (catData as any)?.categories || [];

  useEffect(() => {
    if (open) {
      setTempFT(currentFiletype);
      setTempCat(currentCategory);
      setTempLic(currentLicense);
      setTempSort(currentSort);
      setCatSearch("");
      setGlobalSearch("");
    }
  }, [open, currentFiletype, currentCategory, currentLicense, currentSort]);

  const filteredCategories = categories.filter((c: any) =>
    c.name.toLowerCase().includes(catSearch.toLowerCase()),
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full gap-1 flex-1"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-2xl p-0 flex flex-col pt-4"
        showCloseButton={true}
      >
        <SheetHeader className="px-5 pb-4 border-b">
          <SheetTitle className="text-left text-xl">Filters</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto w-full px-5 pb-5">
          <div className="relative mt-4 mb-2">
            <Input
              type="text"
              placeholder="Search asset here"
              className="w-full rounded-full pl-10 pr-4 h-11 bg-muted/30 focus-visible:ring-offset-0 focus-visible:ring-blue-600"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onKeyDown={handleGlobalSearch}
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <Accordion type="single" collapsible className="w-full">
            {/* Filetype */}
            <AccordionItem value="filetype" className="border-b">
              <AccordionTrigger className="text-base py-4 hover:no-underline">
                File type
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 mt-1">
                  {fileTypes.map((ft) => (
                    <div
                      key={ft.id}
                      className="flex items-center gap-3 py-3 px-2 -mx-2 rounded-lg cursor-pointer active:bg-accent"
                      onClick={() => setTempFT(ft.slug)}
                    >
                      <IconReader
                        name={ft.icon!}
                        className="size-5 opacity-70"
                      />
                      <span className="flex-1 text-base">{ft.name}</span>
                      <div className="size-5 rounded-full border border-primary flex items-center justify-center">
                        {tempFT === ft.slug && (
                          <div className="size-2.5 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Category */}
            <AccordionItem value="category" className="border-b">
              <AccordionTrigger className="text-base py-4 hover:no-underline">
                Category
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="flex items-center gap-2 border rounded-md p-2 mb-3 bg-muted/50">
                  <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    placeholder="Search categories..."
                    className="w-full bg-transparent outline-none text-base"
                    value={catSearch}
                    onChange={(e) => setCatSearch(e.target.value)}
                  />
                </div>
                <div className="space-y-1 max-h-[250px] overflow-y-auto no-scrollbar">
                  {filteredCategories.length === 0 && (
                    <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                      No categories found.
                    </div>
                  )}
                  {filteredCategories.map((c: any) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 py-3 px-2 -mx-2 rounded-lg cursor-pointer active:bg-accent"
                      onClick={() => setTempCat(c.slug)}
                    >
                      <IconReader name={c.icon} className="size-5 opacity-70" />
                      <span className="flex-1 text-base">{c.name}</span>
                      <div className="size-5 rounded-full border border-primary flex items-center justify-center">
                        {tempCat === c.slug && (
                          <div className="size-2.5 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* License */}
            <AccordionItem value="license" className="border-b">
              <AccordionTrigger className="text-base py-4 hover:no-underline">
                License
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 mt-1">
                  {[
                    { val: "all", label: "All Licenses" },
                    { val: "free", label: "Free" },
                    { val: "premium", label: "Premium" },
                  ].map((opt) => (
                    <div
                      key={opt.val}
                      className="flex items-center gap-3 py-2 cursor-pointer"
                      onClick={() => setTempLic(opt.val)}
                    >
                      <span className="flex-1 text-base">{opt.label}</span>
                      <div className="size-5 rounded-full border border-primary flex items-center justify-center">
                        {tempLic === opt.val && (
                          <div className="size-2.5 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Sort by */}
            <AccordionItem value="sort" className="border-none">
              <AccordionTrigger className="text-base py-4 hover:no-underline">
                Sort by:
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 mt-1 -ml-2">
                  {[
                    { val: "relevance", label: "Relevance" },
                    { val: "newest", label: "Newest" },
                    { val: "trending", label: "Trending" },
                  ].map((opt) => (
                    <div
                      key={opt.val}
                      className="flex items-center gap-3 py-2 px-2 rounded-lg cursor-pointer"
                      onClick={() => setTempSort(opt.val)}
                    >
                      <div className="size-5 rounded-full border border-primary flex items-center justify-center mr-1">
                        {tempSort === opt.val && (
                          <div className="size-2.5 bg-primary rounded-full" />
                        )}
                      </div>
                      <span className="flex-1 text-base">{opt.label}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Fixed Footer for Apply Button */}
        <div className="p-4 border-t bg-background mt-auto">
          <Button
            className="w-full h-12 text-base font-semibold rounded-full"
            onClick={() => {
              onApplyMobileFilters(tempFT, tempCat, tempLic, tempSort);
              setOpen(false);
            }}
          >
            Apply
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
// --- End Subcomponent ---

export const ExploreFilters = ({
  fileTypes,
  categories,
  currentFiletype,
  currentCategory,
  currentLicense,
  currentSort,
  onFiletypeChange,
  onCategoryChange,
  onSearchParamChange,
  onApplyMobileFilters,
}: ExploreFiltersProps) => {
  const [ftOpen, setFtOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [catSearch, setCatSearch] = useState("");
  const [licOpen, setLicOpen] = useState(false);

  const filteredCategories = categories.filter((c: any) =>
    c.name.toLowerCase().includes(catSearch.toLowerCase()),
  );

  const activeFileType = fileTypes.find((ft) => ft.slug === currentFiletype);
  const activeCategory = categories.find((cat) => cat.slug === currentCategory);

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center overflow-x-auto no-scrollbar pb-2 md:pb-0">
      {/* Mobile View Filters */}
      <div className="flex md:hidden items-center gap-2 w-full">
        <MobileFilterSheet
          fileTypes={fileTypes}
          currentFiletype={currentFiletype}
          currentCategory={currentCategory}
          currentLicense={currentLicense}
          currentSort={currentSort}
          onApplyMobileFilters={onApplyMobileFilters}
        />
      </div>

      {/* Desktop View Filters */}
      <div className="hidden md:flex flex-wrap items-center w-full justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Filetype Popover */}
          <Popover open={ftOpen} onOpenChange={setFtOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-2 bg-white"
              >
                {activeFileType?.icon ? (
                  <IconReader name={activeFileType.icon} className="size-4" />
                ) : (
                  <LayoutGrid className="h-4 w-4" />
                )}
                {activeFileType?.name || "Filetype"}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[200px] p-2">
              <div className="space-y-1">
                {fileTypes.map((ft) => (
                  <div
                    key={ft.id}
                    className={`flex items-center gap-2 w-full p-2 text-sm rounded-md cursor-pointer hover:bg-accent transition-colors ${
                      currentFiletype === ft.slug ? "bg-accent/50" : ""
                    }`}
                    onClick={() => {
                      onFiletypeChange(ft.slug);
                      setFtOpen(false);
                    }}
                  >
                    <IconReader name={ft.icon!} className="size-4" />
                    <span className="flex-1">{ft.name}</span>
                    {currentFiletype === ft.slug && (
                      <Check className="w-4 h-4 ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Category Popover */}
          <Popover open={catOpen} onOpenChange={setCatOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-2 bg-white"
              >
                {activeCategory?.icon ? (
                  <IconReader name={activeCategory.icon} className="size-4" />
                ) : (
                  <LayoutGrid className="h-4 w-4" />
                )}
                {activeCategory?.name || "Category"}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[250px] p-2">
              <div className="flex items-center gap-2 border-b pb-2 mb-2 px-1">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  placeholder="Search categories..."
                  className="w-full bg-transparent outline-none text-sm"
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                />
              </div>
              <div className="space-y-1 max-h-[300px] overflow-y-auto no-scrollbar">
                {filteredCategories.length === 0 && (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    No categories found.
                  </div>
                )}
                {filteredCategories.map((c: any) => (
                  <div
                    key={c.id}
                    className={`flex items-center gap-2 w-full p-2 text-sm rounded-md cursor-pointer hover:bg-accent transition-colors ${
                      currentCategory === c.slug ? "bg-accent/50" : ""
                    }`}
                    onClick={() => {
                      onCategoryChange(c.slug);
                      setCatOpen(false);
                    }}
                  >
                    <IconReader name={c.icon} className="size-4" />
                    <span className="flex-1">{c.name}</span>
                    {currentCategory === c.slug && (
                      <Check className="w-4 h-4 ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* License Popover */}
          <Popover open={licOpen} onOpenChange={setLicOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-2 bg-white"
              >
                <FileBadge className="h-4 w-4" />
                {currentLicense === "premium"
                  ? "Premium"
                  : currentLicense === "free"
                    ? "Free"
                    : "All Licenses"}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[180px] p-2">
              <div className="space-y-1">
                {[
                  { val: "all", label: "All Licenses" },
                  { val: "free", label: "Free" },
                  { val: "premium", label: "Premium" },
                ].map((opt) => (
                  <div
                    key={opt.val}
                    className={`flex items-center gap-2 w-full p-2 text-sm rounded-md cursor-pointer hover:bg-accent transition-colors ${
                      currentLicense === opt.val ? "bg-accent/50" : ""
                    }`}
                    onClick={() => {
                      onSearchParamChange("license", opt.val);
                      setLicOpen(false);
                    }}
                  >
                    <span className="flex-1">{opt.label}</span>
                    {currentLicense === opt.val && (
                      <Check className="w-4 h-4 ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden md:inline-block">
            Sort by:
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 font-normal rounded-full"
              >
                <ArrowDownUp className="h-4 w-4 mr-1 opacity-70" />
                {currentSort === "newest"
                  ? "Newest"
                  : currentSort === "trending"
                    ? "Trending"
                    : "Relevance"}{" "}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onSearchParamChange("sort", "relevance")}
              >
                Relevance{" "}
                {currentSort === "relevance" && (
                  <Check className="w-4 h-4 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSearchParamChange("sort", "newest")}
              >
                Newest{" "}
                {currentSort === "newest" && (
                  <Check className="w-4 h-4 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSearchParamChange("sort", "trending")}
              >
                Trending{" "}
                {currentSort === "trending" && (
                  <Check className="w-4 h-4 ml-auto" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ExploreFilters;
