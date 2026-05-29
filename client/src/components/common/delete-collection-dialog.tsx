import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteCollection } from "@/hooks/use-collection";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteCollectionDialogProps {
  collection: any;
  onClose: () => void;
}

export function DeleteCollectionDialog({
  collection,
  onClose,
}: DeleteCollectionDialogProps) {
  const { mutate: deleteCollection, isPending } = useDeleteCollection();

  const handleDelete = () => {
    if (!collection) return;

    deleteCollection(collection.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={!!collection} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Collection</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the collection{" "}
            <span className="font-semibold text-foreground">
              {collection?.name}
            </span>
            ? This action cannot be undone, and all items in this collection
            will be deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Ya, Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
