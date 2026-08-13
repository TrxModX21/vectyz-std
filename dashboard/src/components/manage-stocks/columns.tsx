import { ColumnDef } from "@tanstack/react-table";
import { StockData } from "../../../types/manage-stocks";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { convertCreditToIDR } from "@/lib/helpers";

interface GetColumnsProps {
  setStockToApprove: (stock: StockData | null) => void;
  setStockToReject: (stock: StockData | null) => void;
  setStockToDelete: (stock: StockData | null) => void;
  setStockDetail: (stock: StockData | null) => void;
  setDetailModalOpen: (open: boolean) => void;
}

export const getStocksColumns = ({
  setStockToApprove,
  setStockToReject,
  setStockToDelete,
  setStockDetail,
  setDetailModalOpen,
}: GetColumnsProps): ColumnDef<StockData>[] => [
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
      <div onClick={(e) => e.stopPropagation()} className="flex items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-cyber-body data-[state=checked]:bg-neon data-[state=checked]:text-black"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Asset",
    cell: ({ row }) => {
      const stock = row.original;
      const thumbnail = stock.files.find((f) => f.purpose === "PREVIEW")?.url;

      return (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-md border border-cyber-border-subtle bg-cyber-surface-active flex items-center justify-center">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={stock.title}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <ImageIcon className="text-cyber-body-subtle" size={20} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-cyber-heading max-w-50 truncate">
              {stock.title}
            </span>
            <span className="text-[12px] text-cyber-body-subtle flex items-center gap-2">
              <span className="capitalize">{stock.fileType.name}</span>
              <span className="h-1 w-1 rounded-full bg-cyber-border-subtle"></span>
              <span>{stock.category.name}</span>
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "user.name",
    header: "Uploader",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-2">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-cyber-surface-hover flex items-center justify-center text-[10px] text-cyber-body-subtle border border-cyber-border">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-[13px] text-cyber-body font-medium truncate max-w-30">
            {user.name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const isDeleted = !!row.original.deletedAt;

      let badgeStyle = "";
      let displayText = status;

      if (isDeleted) {
        badgeStyle = "bg-[#FF3366]/20 text-[#FF3366] border-[#FF3366]/50 line-through opacity-80";
        displayText = "DELETED";
      } else if (status === "APPROVED")
        badgeStyle = "bg-neon/10 text-neon border-neon/30";
      else if (status === "PENDING")
        badgeStyle = "bg-[#FFD166]/10 text-[#FFD166] border-[#FFD166]/30";
      else if (status === "REJECTED")
        badgeStyle = "bg-[#FF3366]/10 text-[#FF3366] border-[#FF3366]/30";
      else
        badgeStyle =
          "bg-cyber-surface-hover text-cyber-body border-cyber-border";

      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeStyle} uppercase tracking-wider`}
        >
          {displayText}
        </span>
      );
    },
  },
  {
    accessorKey: "isPremium",
    header: "License",
    cell: ({ row }) => {
      const stock = row.original;
      return (
        <div className="flex flex-col gap-1">
          <span
            className={`inline-flex items-center self-start px-2 py-0.5 rounded-sm text-[11px] font-medium border ${
              stock.isPremium
                ? "bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/30"
                : "bg-cyber-surface-hover text-cyber-body-subtle border-cyber-border-subtle"
            }`}
          >
            {stock.isPremium ? "Premium" : "Free"}
          </span>
          {stock.isPremium && Number(stock.price) > 0 && (
            <span className="text-[12px] text-cyber-body-subtle">
              Rp {convertCreditToIDR(Number(stock.price)).toLocaleString()}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Uploaded At",
    cell: ({ row }) => (
      <span className="text-[13px] text-cyber-body-subtle tabular-nums whitespace-nowrap">
        {format(new Date(row.original.createdAt), "dd MMM yyyy, HH:mm")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const stock = row.original;

      return (
        <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-8 w-8 items-center justify-center rounded-cyber border border-cyber-border-subtle bg-cyber-surface-active text-cyber-body-subtle hover:text-cyber-heading hover:bg-cyber-surface-hover transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-cyber border border-cyber-border bg-cyber-surface p-1 shadow-lg glow-neon"
            >
              <DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold text-cyber-body-subtle uppercase tracking-wider mb-1">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setStockDetail(stock);
                  setDetailModalOpen(true);
                }}
                className="flex cursor-pointer w-full items-center gap-2 rounded-sm p-2 text-[13px] font-medium text-cyber-body hover:bg-cyber-surface-hover hover:text-cyber-heading transition-colors"
              >
                <Eye size={14} />
                View Details
              </DropdownMenuItem>
              {stock.status === "PENDING" && !stock.deletedAt && (
                <>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setStockToApprove(stock);
                    }}
                    className="flex cursor-pointer w-full items-center gap-2 rounded-sm p-2 text-[13px] font-medium text-neon focus:bg-neon/10 focus:text-neon transition-colors"
                  >
                    <CheckCircle size={14} />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setStockToReject(stock);
                    }}
                    className="flex cursor-pointer w-full items-center gap-2 rounded-sm p-2 text-[13px] font-medium text-[#FFD166] focus:bg-[#FFD166]/10 focus:text-[#FFD166] transition-colors"
                  >
                    <XCircle size={14} />
                    Reject
                  </DropdownMenuItem>
                </>
              )}
              {!stock.deletedAt && (
                <>
                  <DropdownMenuSeparator className="bg-cyber-border-subtle my-1" />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setStockToDelete(stock);
                    }}
                    className="flex cursor-pointer w-full items-center gap-2 rounded-sm p-2 text-[13px] font-medium text-[#FF3366] focus:bg-[#FF3366]/10 focus:text-[#FF3366] transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete Asset
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
