import Image from "next/image";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow, format } from "date-fns";
import { MoreHorizontal, Edit2, Trash2, Ban, Eye, ShieldCheck, User as UserIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Vectyzen } from "../../../types/manage-vectyzen";
import { cn } from "@/lib/utils";

interface GetVectyzenColumnsProps {
  toggleOfficialIsPending: boolean;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  handleToggleOfficial: (id: string, isOfficial: boolean) => void;
  setVectyzenToBan: (vectyzen: Vectyzen) => void;
  setVectyzenToDelete: (vectyzen: Vectyzen) => void;
}

export const getVectyzenColumns = ({
  toggleOfficialIsPending,
  openMenuId,
  setOpenMenuId,
  handleToggleOfficial,
  setVectyzenToBan,
  setVectyzenToDelete,
}: GetVectyzenColumnsProps): ColumnDef<Vectyzen>[] => [
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
    header: "Vectyzen User",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-cyber-border-subtle bg-cyber-surface-active shrink-0">
          {row.original.image ? (
            <Image
              src={row.original.image}
              alt={row.original.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <div className="h-full w-full bg-cyber-border flex items-center justify-center text-cyber-body">
              <UserIcon size={16} />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-cyber-heading">
            {row.original.name}
          </span>
          <span className="text-[12px] text-cyber-body-subtle">
            {row.original.email}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role & Status",
    cell: ({ row }) => {
      const isBanned = row.original.banned;
      
      return (
        <div className="flex flex-wrap gap-2">
          {isBanned && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#FF3366]/50 bg-[#FF3366]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#FF3366]">
              <Ban size={10} />
              Banned
            </span>
          )}
          {row.original.isPremium && !isBanned && (
            <span className="inline-flex items-center gap-1 rounded-full border border-neon/50 bg-neon/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neon">
              <ShieldCheck size={10} />
              Premium
            </span>
          )}
          <span className="inline-flex items-center rounded-full border border-cyber-border bg-cyber-surface-active px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-cyber-body">
            {row.original.role}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "isOfficial",
    header: "Promote (Official)",
    cell: ({ row }) => {
      const isOfficial = row.original.isOfficial;
      return (
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              handleToggleOfficial(row.original.id, !isOfficial)
            }
            disabled={toggleOfficialIsPending}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
              isOfficial ? "bg-[#54EAFD]" : "bg-[#FF3366]"
            }`}
          >
            <span className="sr-only">Toggle official</span>
            <span
              aria-hidden="true"
               className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-cyber-surface shadow ring-0 transition duration-200 ease-in-out ${
                isOfficial ? "translate-x-2" : "-translate-x-2"
              }`}
            />
          </button>
          <span
            className={cn(
              "text-[12px] font-medium",
              isOfficial ? "text-[#54EAFD]" : "text-cyber-body-subtle"
            )}
          >
            {isOfficial ? "Official" : "Standard"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined / Last Login",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-cyber-heading text-[13px]">
          {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
        </span>
        <span className="text-[11px] text-cyber-body-subtle mt-0.5">
          {row.original.lastLogin ? (
            <>Last seen {formatDistanceToNow(new Date(row.original.lastLogin))} ago</>
          ) : (
            "Never logged in"
          )}
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
            className="w-48 rounded-cyber border border-cyber-border bg-cyber-surface p-2 shadow-lg glow-neon"
          >
            <DropdownMenuItem asChild>
              <Link
                href={`/manage-vectyzen/${row.original.id}`}
                className="flex cursor-pointer w-full items-center gap-2 rounded-sm p-2 text-[13px] font-medium text-cyber-body focus:bg-cyber-surface-hover focus:text-cyber-heading transition-colors"
              >
                <Eye size={14} />
                Detail Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setVectyzenToBan(row.original);
              }}
              className={cn(
                "flex cursor-pointer w-full items-center gap-2 rounded-sm p-2 text-[13px] font-medium transition-colors",
                row.original.banned 
                  ? "text-[#00E676] focus:bg-[#00E676]/10 focus:text-[#00E676]" 
                  : "text-[#F5A623] focus:bg-[#F5A623]/10 focus:text-[#F5A623]"
              )}
            >
              {row.original.banned ? (
                <>
                  <ShieldCheck size={14} /> Unban User
                </>
              ) : (
                <>
                  <Ban size={14} /> Ban User
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-cyber-border-subtle my-1" />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setVectyzenToDelete(row.original);
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
