import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteStock, useUpdateStockStatus } from "@/hooks/use-stocks";
import {
  MoreHorizontal,
  Copy,
  Edit,
  Eye,
  Trash,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import EditDialog from "./edit-dialog";
import { useState } from "react";
import DeleteStockDialog from "./delete-dialog";

const StockTableActions = ({ row }: { row: { original: Stock } }) => {
  const stock = row.original;
  const { mutate: deleteMutation, isPending: deletePending } = useDeleteStock();
  const updateStatus = useUpdateStockStatus();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteStockDialogOpen, setIsDeleteStockDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(stock.id);
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Stock ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={`/stocks/${stock.slug}`}
              className="w-full flex items-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <div
              className="w-full flex items-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditDialogOpen(true);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Stock
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              updateStatus.mutate({ id: stock.id, status: "APPROVED" });
            }}
            disabled={stock.status === "APPROVED"}
          >
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              updateStatus.mutate({
                id: stock.id,
                status: "REJECTED",
                rejectionReason: "Quick rejection",
              });
            }}
            disabled={stock.status === "REJECTED"}
            className="text-destructive focus:text-destructive"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteStockDialogOpen(true);
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditDialog
        id={row.original.id}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <DeleteStockDialog
        open={isDeleteStockDialogOpen}
        onOpenChage={setIsDeleteStockDialogOpen}
        confirmDelete={() => {
          deleteMutation(stock.id, {
            onSuccess: () => {
              setIsDeleteStockDialogOpen(false);
            },
          });
        }}
        isLoading={deletePending}
        description={`This will remove the file and data in this stock "${stock.title}" from server. This action cannot be undone!`}
      />
    </>
  );
};

export default StockTableActions;
