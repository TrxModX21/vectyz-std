"use client";

import DragHandleTable from "@/components/data-table/drag-handler";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import TableColumnHeader from "@/components/data-table/column-header";
import { format, formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ColorTableAction from "./table-action";

export const columns: ColumnDef<Color>[] = [
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
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="size-6 rounded-full border shadow-sm cursor-pointer"
            style={{ backgroundColor: row.original.color }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {row.original.name} ({row.original.color})
          </p>
        </TooltipContent>
      </Tooltip>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <TableColumnHeader column={column} title="Name" />,
    enableHiding: false,
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => <Badge variant="secondary">{row.original.slug}</Badge>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground font-medium">
            {format(date, "yyyy-MM-dd hh:mm a")}
          </span>
          <span className="text-muted-foreground text-xs">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ColorTableAction row={row} />,
  },
];
