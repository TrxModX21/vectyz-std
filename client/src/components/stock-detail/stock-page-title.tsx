import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Share2 } from "lucide-react";
import LikeStock from "../common/like-stock";
import { ShareDialog } from "../common/share-dialog";

type Props = {
  stock?: Stock;
};

const StockPageTitle = ({ stock }: Props) => {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {stock?.title}
        </h1>
        <div className="flex flex-wrap gap-2">
          {stock?.keywords.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="hover:bg-secondary/80 cursor-pointer"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <LikeStock stock={stock} variant="outline" />

        <ShareDialog
          url={`${window.location.origin}/stock/${stock?.slug}`}
          title={`Share ${stock?.title}`}
        >
          <Button variant="outline" size="icon" className="rounded-full">
            <Share2 className="h-4 w-4" />
          </Button>
        </ShareDialog>
      </div>
    </div>
  );
};

export default StockPageTitle;
