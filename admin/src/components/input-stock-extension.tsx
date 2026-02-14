import { IconCopy, IconTrash } from "@tabler/icons-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Separator } from "./ui/separator";

interface Props {
  counter: number;
  maxCounter: string;
  onCopy: () => void;
  onDelete: () => void;
}

const InputStockExtension = ({
  counter,
  maxCounter,
  onCopy,
  onDelete,
}: Props) => {
  return (
    <div className="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-focus-within/field:opacity-100 hover:opacity-100">
      <div className="flex items-center rounded-md border bg-background p-0.5 shadow-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-sm text-muted-foreground hover:text-foreground"
                type="button"
                onClick={onCopy}
              >
                <IconCopy className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy Title</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-0.5 h-3" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-sm text-muted-foreground hover:text-destructive"
                type="button"
                onClick={onDelete}
              >
                <IconTrash className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear Title</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <span className="text-xs text-muted-foreground">
        {counter}/{maxCounter}
      </span>
    </div>
  );
};

export default InputStockExtension;
