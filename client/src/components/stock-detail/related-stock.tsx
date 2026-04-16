import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRef } from "react";
import { useGetRelatedStock } from "@/hooks/use-stock";
import StockCard from "../common/stock-card";

type Props = { stock?: Stock; isLoading: boolean };

const RelatedStock = ({ stock, isLoading }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const { data: relatedStocks } = useGetRelatedStock(
    isLoading ? "" : stock?.id!,
    20,
  );
  const related = relatedStocks?.stocks || [];

  if (related.length === 0) {
    return null;
  }

  return (
    <div className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">You might also like</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 shrink-0"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 shrink-0"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {related.map((item) => {
          const relatedPreviewImage = item?.files.find(
            (f) => f.purpose === "PREVIEW",
          )?.url;

          const originalFile = item?.files.find(
            (f) => f.purpose === "ORIGINAL",
          );

          const width = originalFile?.width || 800;
          const height = originalFile?.height || 600;
          const aspectRatio = width / height;

          return (
            <StockCard
              key={item.id}
              stock={item}
              className="snap-start shrink-0"
              useFill={true}
              useImagePadding={true}
              style={{
                flexGrow: aspectRatio,
                flexBasis: `${Math.max(aspectRatio * 270, 0)}px`,
                height: "270px",
              }}
              aspectRatio={aspectRatio}
              previewUrl={relatedPreviewImage}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RelatedStock;
