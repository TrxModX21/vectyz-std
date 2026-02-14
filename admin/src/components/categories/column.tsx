import DragHandleTable from "@/components/data-table/drag-handler";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import StatusSwitch from "./status-switch";
import TableColumnHeader from "@/components/data-table/column-header";
import { format, formatDistanceToNow } from "date-fns";
import CategoryTableAction from "./table-action";

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.original.image;
      const name = row.original.name;
      return (
        <Avatar className="h-9 w-9">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
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
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => <Badge variant="secondary">{row.original.slug}</Badge>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <StatusSwitch id={row.original.id} initialStatus={row.original.status} />
    ),
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
    cell: ({ row }) => <CategoryTableAction row={row} />,
  },
];
