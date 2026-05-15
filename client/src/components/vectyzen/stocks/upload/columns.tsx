import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Download, Eye, Heart, MoreHorizontal } from "lucide-react";
import Image from "next/image";

export const columns: ColumnDef<UserStock>[] = [
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
              className="object-contain"
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
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col">
              <span className="max-w-[220px] truncate font-medium">
                {row.getValue("title")}
              </span>
              <span className="max-w-[220px] truncate text-xs text-muted-foreground">
                {row.original.slug}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.getValue("title")}</p>
          </TooltipContent>
        </Tooltip>
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
      const text =
        status === "APPROVED"
          ? "Published"
          : status === "PENDING"
            ? "Under Review"
            : "Rejected";

      return <Badge variant={variant}>{text}</Badge>;
    },
  },
  {
    accessorKey: "download",
    header: () => (
      <span className="flex items-center justify-center">Downloads</span>
    ),
    cell: ({ row }) => {
      return (
        <span className="flex items-center justify-center gap-1">
          <Download className="h-3 w-3 text-v-green" />
          {row.original.totalDownloads}
        </span>
      );
    },
  },
  {
    accessorKey: "likes",
    header: () => (
      <span className="flex items-center justify-center">Likes</span>
    ),
    cell: ({ row }) => {
      return (
        <span className="flex items-center justify-center gap-1">
          <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          {row.original.totalLikes}
        </span>
      );
    },
  },
  {
    accessorKey: "views",
    header: () => (
      <span className="flex items-center justify-center">Views</span>
    ),
    cell: ({ row }) => {
      return (
        <span className="flex items-center justify-center gap-1">
          <Eye className="h-3 w-3 text-primary" />
          {row.original.totalViews}
        </span>
      );
    },
  },
  {
    accessorKey: "date",
    header: () => (
      <span className="flex items-center justify-center">Date</span>
    ),
    cell: ({ row }) => {
      console.log(row.original.createdAt);
      const date = row.original.createdAt;
      const formatted = format(new Date(date), "MMM dd, yyyy");

      return (
        <span className="text-muted-foreground flex items-center justify-center">
          {formatted}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
