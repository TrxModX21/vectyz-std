'use client';

import FadeIn from "@/components/common/fade-in";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RejectedTable from "@/components/vectyzen/stocks/rejected/table";
import StockDetailSheet from "@/components/vectyzen/stocks/stock-detail-sheet";
import { useAuth } from "@/hooks/use-auth";
import { useGetCategories } from "@/hooks/use-categories";
import { useGetFileTypes } from "@/hooks/use-file-type";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCheckAccess } from "@/hooks/use-transactions";
import { useGetUserStocksList } from "@/hooks/use-user-stocks";
import {
  ArrowDownUp,
  ImagePlus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";

const RejectedPage = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [selectedStock, setSelectedStock] = useState<UserStock | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 500);

  const [sortBy, setSortBy] = useState<
    "createdAt" | "totalDownloads" | "title"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [sortTitle, setSortTitle] = useState<string>("Created");
  const [selectedSortRadio, setSelectedSortRadio] =
    useState<string>("created-newest");

  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [fileTypeId, setFileTypeId] = useState<string | undefined>(undefined);

  const [isPremium, setIsPremium] = useState<boolean | undefined>(undefined);

  const { data: userProfileResponse, isLoading: userDataLoading } = useAuth();
  const user = userProfileResponse?.user;
  const { data: responseData, isLoading: dataLoading } = useGetUserStocksList({
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
    status: "REJECTED",
    categoryId: categoryId === "all" ? undefined : categoryId,
    fileTypeId: fileTypeId === "all" ? undefined : fileTypeId,
    isPremium: isPremium !== undefined ? String(isPremium) : undefined,
  });
  const { data: access, isLoading: checkingAccess } = useCheckAccess(
    selectedStock?.id,
    !!user,
  );
  const hasAccess = access?.allowed;
  const isLoading = dataLoading || userDataLoading || checkingAccess;

  const { data: categoriesResponse } = useGetCategories();
  const categories = categoriesResponse?.categories ?? [];

  const { data: fileTypesResponse } = useGetFileTypes();
  const fileTypes = fileTypesResponse?.fileTypes ?? [];

  const clearFilters = () => {
    setSearch("");
    setCategoryId(undefined);
    setFileTypeId(undefined);
    setIsPremium(undefined);
    setPage(1);
  };

  const handleSortChange = (val: string) => {
    setSelectedSortRadio(val); // Update visual radio button terpilih
    setPage(1); // Reset ke halaman pertama setiap kali filter/sorting berubah
    switch (val) {
      case "created-newest":
        setSortBy("createdAt");
        setSortOrder("desc");
        setSortTitle("Created");
        break;
      case "created-oldest":
        setSortBy("createdAt");
        setSortOrder("asc");
        setSortTitle("Created");
        break;
      case "name-a-z":
        setSortBy("title");
        setSortOrder("asc");
        setSortTitle("Name");
        break;
      case "name-z-a":
        setSortBy("title");
        setSortOrder("desc");
        setSortTitle("Name");
        break;
      case "downloads-highest":
        setSortBy("totalDownloads");
        setSortOrder("desc");
        setSortTitle("Downloads");
        break;
      case "downloads-lowest":
        setSortBy("totalDownloads");
        setSortOrder("asc");
        setSortTitle("Downloads");
        break;
    }
  };

  const activeFiltersCount =
    (categoryId && categoryId !== "all" ? 1 : 0) +
    (fileTypeId && fileTypeId !== "all" ? 1 : 0) +
    (isPremium !== undefined ? 1 : 0);

  return (
    <section>
      <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Uploads</h1>
            <p className="text-muted-foreground">
              Manage your uploaded assets.
            </p>
          </div>
          <Button
            size={isMobile ? "icon-lg" : "default"}
            onClick={() => router.push("/vectyzen/create-stock")}
          >
            {isMobile ? <ImagePlus /> : "Upload New"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-6 item-start lg:items-center justify-between">
              <div>
                <CardTitle>Rejected Asset</CardTitle>
                <CardDescription>
                  This page show list of your rejected asset.
                </CardDescription>
              </div>
              <div className="relative w-full lg:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search asset...."
                  className="pl-8"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Filter */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 flex items-center gap-2"
                    >
                      <ArrowDownUp className="h-4 w-4" />
                      <span>
                        Sort By:{" "}
                        <span className="font-semibold text-primary">
                          {sortTitle}
                        </span>
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[180px]">
                    <DropdownMenuRadioGroup
                      value={selectedSortRadio} // Menggunakan state dinamis
                      onValueChange={handleSortChange}
                    >
                      <DropdownMenuRadioItem value="created-newest">
                        Created (Newest)
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="created-oldest">
                        Created (Oldest)
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="name-a-z">
                        Name (A-Z)
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="name-z-a">
                        Name (Z-A)
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="downloads-highest">
                        Downloads (Highest)
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="downloads-lowest">
                        Downloads (Lowest)
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 flex items-center gap-2"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      <span>Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[280px]">
                    <DropdownMenuLabel>Filter Stocks</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <div className="p-2 space-y-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Category</Label>
                        <Select
                          value={categoryId || "all"}
                          onValueChange={(val) => {
                            setCategoryId(val);
                            setPage(1);
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs w-full">
                            <SelectValue placeholder="All Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Category</SelectItem>
                            {categories.map((cat: Category) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            )) ?? []}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs">File Type</Label>
                        <Select
                          value={fileTypeId || "all"}
                          onValueChange={(val) => {
                            setFileTypeId(val);
                            setPage(1);
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs w-full">
                            <SelectValue placeholder="All Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All File Type</SelectItem>
                            {fileTypes.map((file: FileType) => (
                              <SelectItem key={file.id} value={file.id}>
                                {file.name}
                              </SelectItem>
                            )) ?? []}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuCheckboxItem
                      checked={isPremium === undefined}
                      onCheckedChange={() => {
                        setIsPremium(undefined);
                        setPage(1);
                      }}
                    >
                      All assets
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={isPremium === true}
                      onCheckedChange={() => {
                        setIsPremium(true);
                        setPage(1);
                      }}
                    >
                      Premium assets only
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={isPremium === false}
                      onCheckedChange={() => {
                        setIsPremium(false);
                        setPage(1);
                      }}
                    >
                      Free assets only
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuSeparator />
                    <div className="p-2 flex items-center justify-end cursor-pointer hover:bg-accent rounded-sm">
                      {/* <span className="text-xs font-semibold">Reset All</span> */}
                      <span className="text-xs text-muted-foreground">
                        {activeFiltersCount} filter
                        {activeFiltersCount !== 1 ? "s" : ""} active
                      </span>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {(search ||
                  categoryId ||
                  fileTypeId ||
                  isPremium !== undefined) && (
                  // minPrice ||
                  // maxPrice
                  <Button
                    variant="outline"
                    size={isMobile ? "icon-sm" : "sm"}
                    onClick={clearFilters}
                    title="Clear Filters"
                  >
                    <X className="h-4 w-4" />
                    {!isMobile && <span>Clear Filters</span>}
                  </Button>
                )}
              </div>
            </div>

            <RejectedTable
              isLoading={isLoading}
              stocks={responseData?.stocks || []}
              totalCount={responseData?.totalCount || 0}
              page={page}
              limit={limit}
              onPageChange={setPage}
              onPageSizeChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
              onRowClick={(stock) => setSelectedStock(stock)}
            />
          </CardContent>
        </Card>
      </FadeIn>

      <StockDetailSheet
        user={user!}
        isLoading={isLoading}
        hasAccess={hasAccess}
        stock={selectedStock}
        open={!!selectedStock}
        onOpenChange={(open) => !open && setSelectedStock(null)}
      />
    </section>
  );
};

export default RejectedPage;
