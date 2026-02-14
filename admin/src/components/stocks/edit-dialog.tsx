import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import { useGetStock } from "@/hooks/use-stocks";
import { EditStockForm } from "./edit-stock-form";
import EditDialogSkeleton from "./edit-dialog-skeleton";

interface Props {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditDialog = ({ id, open, onOpenChange }: Props) => {
  const { data: stockResponse, isLoading, isError } = useGetStock(id);
  const stock = stockResponse?.stock;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay onClick={(e) => e.stopPropagation()}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          className="min-w-4xl max-h-[85%] overflow-y-scroll"
          showCloseButton={false}
        >
          {isLoading ? (
            <EditDialogSkeleton />
          ) : (
            <DialogHeader>
              <DialogTitle>Edit Stock</DialogTitle>
              <DialogDescription>
                Update the details for &quot;{stock?.title || 404}&quot;
              </DialogDescription>
            </DialogHeader>
          )}

          {isError || !stock ? (
            <NotFound />
          ) : (
            <EditStockForm stock={stock} onOpenChange={onOpenChange} />
          )}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

const NotFound = () => {
  return (
    <div className="flex h-96 flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">Stock Not Found</h2>
      <p className="text-muted-foreground">
        The stock you are looking for does not exist or has been deleted.
      </p>
    </div>
  );
};

export default EditDialog;
