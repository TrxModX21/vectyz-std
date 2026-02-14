import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

export const FullImageDialog = ({
  previewUrl,
  title,
  description,
  open,
  onOpenChange,
}: {
  previewUrl: string;
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-fit h-fit p-0 border-none bg-red-800 shadow-none [&>button]:hidden flex items-center justify-center">
        <DialogHeader>
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        </DialogHeader>
        <Image
          src={previewUrl}
          alt={title}
          width={1200}
          height={800}
          className="object-contain w-auto h-auto max-w-[90vw] max-h-[90vh] rounded-md"
          priority
        />
      </DialogContent>
    </Dialog>
  );
};
