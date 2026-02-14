"use strict";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import StockTableActions from "./table-action";
import DragHandleTable from "../data-table/drag-handler";

export const columns: ColumnDef<Stock>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandleTable id={row.original.id} />,
    enableSorting: false,
    enableHiding: false,
    maxSize: 40,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    maxSize: 40,
  },
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => {
      const thumbnail = row.original.files.find(
        (f: File) => f.purpose === "PREVIEW",
      )?.url;
      
      return (
        <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={row.original.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              No Img
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("title")}
          </span>
          <span className="max-w-[200px] truncate text-xs text-muted-foreground">
            {row.original.slug}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category.name;
      const fileType = row.original.fileType.name;
      return (
        <div className="flex flex-col gap-1">
          <Badge variant="outline" className="w-fit">
            {category}
          </Badge>
          <span className="text-xs text-muted-foreground">{fileType}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const isPremium = row.original.isPremium;

      if (!isPremium) return <Badge variant="secondary">Free</Badge>;

      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(price);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "user",
    header: "Uploader",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-2">
          {/* Avatar component matching layout, or simple fallback */}
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {user?.name || "Unknown"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "APPROVED"
          ? "default" // or success/green if available
          : status === "PENDING"
            ? "secondary" // or yellow/warning
            : "destructive";

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <StockTableActions row={row} />,
  },
];
