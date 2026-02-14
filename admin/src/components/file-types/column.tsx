"use client";

import DragHandleTable from "@/components/data-table/drag-handler";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import TableColumnHeader from "@/components/data-table/column-header";
import { format, formatDistanceToNow } from "date-fns";
import FileTypeTableAction from "./table-action";
import * as TablerIcons from "@tabler/icons-react";

export const columns: ColumnDef<FileType>[] = [
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
    accessorKey: "icon",
    header: "Icon",
    cell: ({ row }) => {
      const iconName = row.original.icon;
      if (!iconName) return <span className="text-muted-foreground">-</span>;
      const Icon = TablerIcons[
        iconName as keyof typeof TablerIcons
      ] as React.ElementType;
      return Icon ? (
        <Icon className="size-6" />
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <TableColumnHeader column={column} title="Name" />,
    enableHiding: false,
  },
  {
    accessorKey: "supportedFileExtension",
    header: "Extensions",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.supportedFileExtension}</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "default" : "secondary"}
      >
        {row.original.status}
      </Badge>
    ),
    enableSorting: false,
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
    cell: ({ row }) => <FileTypeTableAction row={row} />,
  },
];
