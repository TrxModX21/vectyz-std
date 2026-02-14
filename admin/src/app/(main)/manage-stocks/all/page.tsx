"use client";

import { useGetStocks } from "@/hooks/use-stocks";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item";
import StocksTable from "../../../../components/stocks/stocks-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCategories } from "@/hooks/use-category";
import { useGetFileTypes } from "@/hooks/use-file-type";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, X } from "lucide-react";
import { StockDetailsSheet } from "@/components/stocks/stock-details-sheet";
import AddStockDialog from "@/components/stocks/add-dialog";

export default function AllStockPage() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const debouncedSearch = useDebounce(search, 500);

  // Filters State
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [fileTypeId, setFileTypeId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<
    "PENDING" | "APPROVED" | "REJECTED" | undefined
  >(undefined);
  const [isPremium, setIsPremium] = useState<string | undefined>(undefined); // "true" | "false"
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  // Price range can be added if needed, sticking to basic filters first as requested

  const { data, isLoading } = useGetStocks({
    page,
    limit,
    search: debouncedSearch,
    categoryId: categoryId === "all" ? undefined : categoryId,
    fileTypeId: fileTypeId === "all" ? undefined : fileTypeId,
    status: status === ("all" as any) ? undefined : (status as any),
    isPremium: isPremium === "all" ? undefined : isPremium,
    minPrice,
    maxPrice,
  });

  const { data: categoriesResponse } = useGetCategories();
  const { data: fileTypesResponse } = useGetFileTypes();

  const categories = categoriesResponse?.categories ?? [];
  const fileTypes = fileTypesResponse?.fileTypes ?? [];

  const clearFilters = () => {
    setSearch("");
    setCategoryId(undefined);
    setFileTypeId(undefined);
    setStatus(undefined);
    setIsPremium(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setPage(1);
  };

  return (
    <section className="px-8 space-y-6">
      <Item variant="outline" className="flex-col lg:flex-row">
        <ItemContent className="w-full items-center lg:w-fit lg:items-start">
          <ItemTitle className="text-2xl font-semibold">All Stocks</ItemTitle>
          <ItemDescription>
            Manage and monitor all uploaded stock assets.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" onClick={() => setOpenCreateDialog(true)}>
            <PlusCircleIcon />
            Add Stock
          </Button>
        </ItemActions>
      </Item>

      <div className="flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search stocks..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-[200px] lg:w-[300px]"
          />

          <Select
            value={status || "all"}
            onValueChange={(val) => {
              setStatus(val as any);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={categoryId || "all"}
            onValueChange={(val) => {
              setCategoryId(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              )) ?? []}
            </SelectContent>
          </Select>

          <Select
            value={fileTypeId || "all"}
            onValueChange={(val) => {
              setFileTypeId(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="File Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {fileTypes.map((ft: any) => (
                <SelectItem key={ft.id} value={ft.id}>
                  {ft.name}
                </SelectItem>
              )) ?? []}
            </SelectContent>
          </Select>

          <Select
            value={isPremium || "all"}
            onValueChange={(val) => {
              setIsPremium(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Premium?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Premium</SelectItem>
              <SelectItem value="false">Free</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min Price"
              value={minPrice || ""}
              onChange={(e) => {
                setMinPrice(
                  e.target.value ? parseInt(e.target.value) : undefined,
                );
                setPage(1);
              }}
              className="w-[100px]"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max Price"
              value={maxPrice || ""}
              onChange={(e) => {
                setMaxPrice(
                  e.target.value ? parseInt(e.target.value) : undefined,
                );
                setPage(1);
              }}
              className="w-[100px]"
            />
          </div>

          {(search ||
            categoryId ||
            fileTypeId ||
            status ||
            isPremium ||
            minPrice ||
            maxPrice) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFilters}
              title="Clear Filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Table */}
        <StocksTable
          isLoading={isLoading}
          stocks={data?.stocks || []}
          totalCount={data?.totalCount || 0}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onPageSizeChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          onRowClick={(stock) => setSelectedStock(stock)}
        />

        <StockDetailsSheet
          stock={selectedStock}
          open={!!selectedStock}
          onOpenChange={(open) => !open && setSelectedStock(null)}
        />

        <AddStockDialog
          open={openCreateDialog}
          onOpenChange={setOpenCreateDialog}
        />
      </div>
    </section>
  );
}
