import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow, format } from "date-fns";
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category } from "../../../types/manage-categories";

interface GetCategoryColumnsProps {
  changeVisibilityIsPending: boolean;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  handleToggleVisibility: (id: string, status: "active" | "inactive") => void;
  setCategoryToEdit: (category: Category) => void;
  setCategoryToDelete: (category: Category) => void;
}

export const getCategoryColumns = ({
  changeVisibilityIsPending,
  openMenuId,
  setOpenMenuId,
  handleToggleVisibility,
  setCategoryToEdit,
  setCategoryToDelete,
}: GetCategoryColumnsProps): ColumnDef<Category>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-cyber-body data-[state=checked]:bg-neon data-[state=checked]:text-black"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-cyber-body data-[state=checked]:bg-neon data-[state=checked]:text-black"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Category Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-cyber-border-subtle bg-cyber-surface-active shrink-0">
          {row.original.image ? (
            <Image
              src={row.original.image}
              alt={row.original.name}
              fill
              className="object-cover"
              sizes="32px"
            />
          ) : (
            <div className="h-full w-full bg-cyber-border flex items-center justify-center text-xs">
              {row.original.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-cyber-heading">
            {row.original.name}
          </span>
          <span className="text-[11px] text-cyber-body-subtle">
            {row.original._count?.stocks || 0} assets
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-cyber-border bg-cyber-surface-active px-2.5 py-0.5 text-[11px] font-medium text-cyber-body">
        {row.original.slug}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.status === "active";
      return (
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              handleToggleVisibility(row.original.id, row.original.status)
            }
            disabled={changeVisibilityIsPending}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
              isActive ? "bg-[#54EAFD]" : "bg-[#FF3366]"
            }`}
          >
            <span className="sr-only">Toggle status</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-cyber-surface shadow ring-0 transition duration-200 ease-in-out ${
                isActive ? "translate-x-2" : "-translate-x-2"
              }`}
            />
          </button>
          <span
            className={`text-[12px] font-medium capitalize ${
              isActive ? "text-[#54EAFD]" : "text-[#FF3366]"
            }`}
          >
            {row.original.status}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-cyber-heading">
          {format(new Date(row.original.createdAt), "yyyy-MM-dd hh:mm a")}
        </span>
        <span className="text-[11px] text-cyber-body-subtle">
          {formatDistanceToNow(new Date(row.original.createdAt))} ago
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center w-full">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-cyber text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 rounded-cyber border border-cyber-border bg-cyber-surface p-2 shadow-lg glow-neon"
          >
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setCategoryToEdit(row.original);
              }}
              className="flex cursor-pointer w-full items-center gap-2 rounded-sm p-2 text-[13px] font-medium text-cyber-body focus:bg-cyber-surface-hover focus:text-cyber-heading transition-colors"
            >
              <Edit2 size={14} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setCategoryToDelete(row.original);
              }}
              className="flex cursor-pointer w-full items-center gap-2 rounded-sm p-2 text-[13px] font-medium text-[#FF3366] focus:bg-[#FF3366]/10 focus:text-[#FF3366] transition-colors"
            >
              <Trash2 size={14} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
