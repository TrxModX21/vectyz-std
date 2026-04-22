"use client";

import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Share2 } from "lucide-react";
import LikeStock from "../common/like-stock";
import { ShareDialog } from "../common/share-dialog";

type Props = {
  stock?: Stock;
};

const StockPageTitle = ({ stock }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const tags = stock?.keywords || [];
  const maxTags = 10;
  const hasMoreTags = tags.length > maxTags;

  const displayedTags = isExpanded ? tags : tags.slice(0, maxTags);

  return (
    <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 items-start justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {stock?.title}
        </h1>
        <div className="flex flex-wrap gap-2">
          {displayedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="hover:bg-secondary/80 cursor-pointer"
            >
              #{tag}
            </Badge>
          ))}
          {hasMoreTags && (
            <Badge
              variant="outline"
              className="cursor-pointer border-dashed hover:bg-muted font-medium"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "show less" : `+${tags.length - maxTags} another tag`}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <LikeStock stock={stock} variant="outline" />

        <ShareDialog
          url={`${typeof window !== 'undefined' ? window.location.origin : ''}/stock/${stock?.slug}`}
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
