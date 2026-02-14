"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import TableColumnHeader from "@/components/data-table/column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AllUserTableAction from "./table-action";
import { format, formatDistanceToNow } from "date-fns";
import DragHandleTable from "../data-table/drag-handler";
import { Checkbox } from "../ui/checkbox";

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "name",
    header: ({ column }) => <TableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={row.original.image || ""} alt={row.original.name} />
          <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <span className="font-medium">{row.original.name}</span>
          <span className="truncate">@{row.original.username}</span>
        </div>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <TableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Balance" />
    ),
    cell: ({ row }) => {
      const wallets = row.original.wallets || [];
      const idrWallet = wallets.find((w) => w.currency === "IDR");
      const balance = idrWallet ? Number(idrWallet.balance) : 0;

      return (
        <span className="font-medium">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(balance)}
        </span>
      );
    },
  },
  {
    accessorKey: "banned",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.banned ? "destructive" : "default"}>
        {row.original.banned ? "Banned" : "Active"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Joined At" />
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
    cell: ({ row }) => <AllUserTableAction row={row} />,
  },
];
