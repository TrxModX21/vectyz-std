import { Loader } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

interface Props {
  open: boolean;
  onOpenChage: (open: boolean) => void;
  confirmDelete: () => void;
  description: string;
  isLoading?: boolean;
}

const DeleteStockDialog = ({
  open,
  onOpenChage,
  confirmDelete,
  description,
  isLoading = false,
}: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChage}>
      <AlertDialogOverlay onClick={(e) => e.stopPropagation()}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {/* <AlertDialogAction asChild> */}
              <Button
                disabled={isLoading}
                onClick={confirmDelete}
                variant="destructive"
              >
                {isLoading && <Loader className="animate-spin" />}
                Delete
              </Button>
            {/* </AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteStockDialog;
