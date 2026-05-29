import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateCollection } from "@/hooks/use-collection";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface EditCollectionDialogProps {
  collection: any;
  onClose: () => void;
}

export function EditCollectionDialog({
  collection,
  onClose,
}: EditCollectionDialogProps) {
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const { mutate: updateCollection, isPending } = useUpdateCollection();

  // Reset local state when collection changes
  useEffect(() => {
    if (collection) {
      setTitle(collection.name || "");
      setVisibility(collection.isPrivate ? "private" : "public");
    }
  }, [collection]);

  const handleSave = () => {
    if (!title.trim() || !collection) return;

    updateCollection(
      {
        id: collection.id,
        name: title,
        isPrivate: visibility === "private",
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={!!collection} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Collection Information</DialogTitle>
          <DialogDescription>
            Update the title and visibility for your collection.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Collection Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter collection title"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select
              value={visibility}
              onValueChange={(val: "public" | "private") => setVisibility(val)}
              disabled={isPending}
            >
              <SelectTrigger id="visibility" className="w-full">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending || !title.trim()}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
