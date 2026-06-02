import { ColumnDef } from "@tanstack/react-table";
import { File, History } from "../../../../types/download";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import DownloadButton from "./download-button";

export const columns: ColumnDef<History>[] = [
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => {
      const thumbnail = row.original.stock.files.find(
        (f: File) => f.purpose === "PREVIEW",
      )?.url;

      return (
        <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={row.original.stock.title}
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
    header: "Asset Name",
    cell: ({ row }) => {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col">
              <span className="max-w-[220px] truncate font-medium flex items-center gap-2">
                {row.original.stock.title}
                {row.original.stock.status !== "DELETED" && (
                  <Badge variant="destructive" className="text-[10px] h-4 px-1">
                    Removed
                  </Badge>
                )}
              </span>
              <span className="max-w-[220px] truncate text-xs text-muted-foreground">
                {row.original.stock.id}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.original.stock.title}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "uploader",
    header: "Uploader",
    cell: ({ row }) => {
      return row.original.stock.user.name;
    },
  },
  {
    accessorKey: "license",
    header: "License",
    cell: ({ row }) => {
      const isPremium = row.original.isUserPremium;
      const variant = isPremium ? "default" : "secondary";
      const text = isPremium ? "Premium" : "Free";

      return <Badge variant={variant}>{text}</Badge>;
    },
  },
  {
    accessorKey: "date",
    header: () => (
      <span className="flex items-center justify-center">Date</span>
    ),
    cell: ({ row }) => {
      const date = row.original.downloadDate;
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
    cell: ({ row }) => <DownloadButton stock={row.original.stock} />,
  },
];
