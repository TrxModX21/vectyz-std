import { Plus, Sparkles, Wallet, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import TopUpDialog from "./top-up-dialog";
import { cn } from "@/lib/utils";

const CreditTopUp = ({
  user,
  className,
}: {
  user: User | undefined;
  className?: string;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <TopUpDialog>
            <Button
              variant="outline"
              className={cn(
                "hidden md:flex h-9 gap-1 border-primary/20 hover:bg-primary/5 hover:text-primary",
                className,
              )}
            >
              <Zap className="h-4 w-4 text-primary fill-primary/20" />
              <span className="font-semibold">
                {Number(user?.creditBalance || 0)}
              </span>
              <Plus className="h-3 w-3 ml-1 opacity-50" />
            </Button>
          </TopUpDialog>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="p-3 gap-2 flex flex-col w-48">
        <p className="font-semibold text-center border-b pb-2 mb-1">
          Credit Balance
        </p>
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <Wallet className="h-3 w-3" /> Purchased:
          </span>
          <span className="font-mono font-medium">
            {Number(user?.purchasedCredit || 0)}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Earned:
          </span>
          <span className="font-mono font-medium">
            {Number(user?.earnedCredit || 0)}
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default CreditTopUp;
