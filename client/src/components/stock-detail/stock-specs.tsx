import { Crown, Info, Layers, Maximize2, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const StockSpecs = ({ stock }: { stock?: Stock }) => {
  const previewFile = stock?.files.find((f) => f.purpose === "PREVIEW");
  const originalFile = stock?.files.find((f) => f.purpose === "ORIGINAL");

  const width = originalFile?.width || previewFile?.width;
  const height = originalFile?.height || previewFile?.height;

  const originalFormats =
    stock?.files
      ?.filter((f) => f.purpose === "ORIGINAL")
      .map((f) => (f.format || stock?.fileType?.name || "JPG").toUpperCase()) ||
    [];

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-xs font-bold text-zinc-500 uppercase mb-4 tracking-wider">
          Information
        </h3>
        {stock?.isPremium && (
          <div className="flex items-center gap-2 mb-4 text-amber-500">
            <Crown className="w-5 h-5 fill-amber-500" />
            <span className="font-bold text-sm">Premium photo</span>
          </div>
        )}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-dashed">
            <span className="text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Licence
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-zinc-800">
                {stock?.isPremium ? "Premium" : "Free"}
              </span>
              <a
                href="#"
                className="text-blue-500 hover:text-blue-400 font-medium"
              >
                More info
              </a>
            </div>
          </div>
          <div className="flex justify-between py-2 border-b border-dashed">
            <span className="text-muted-foreground flex items-center gap-2">
              <Maximize2 className="h-4 w-4" /> Dimensions
            </span>
            <span className="font-bold text-zinc-800">
              {width}px x {height}px
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-dashed">
            <span className="text-muted-foreground flex items-center gap-2">
              <Layers className="h-4 w-4" /> Format
            </span>
            <div>
              {originalFormats.map((format, index) => (
                <span key={index} className="font-bold text-zinc-800">
                  {format}
                  {index < originalFormats.length - 1 && ", "}
                </span>
              ))}
            </div>
            {/* <span className="font-bold text-zinc-800">{format}</span> */}
          </div>
          <div className="flex justify-between py-2 border-b border-dashed">
            <span className="text-muted-foreground flex items-center gap-2">
              <Info className="h-4 w-4" /> Attribution
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-zinc-800">Required</span>
              <a
                href="#"
                className="text-blue-500 hover:text-blue-400 font-medium"
              >
                How to attribute?
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockSpecs;
