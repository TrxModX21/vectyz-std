import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Crown, ZoomIn } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type Props = {
  stock?: Stock;
  setIsZoomOpen: Dispatch<SetStateAction<boolean>>;
};

const StockPreview = ({ stock, setIsZoomOpen }: Props) => {
  const previewFile = stock?.files.find((f) => f.purpose === "PREVIEW");
  const originalFile = stock?.files.find((f) => f.purpose === "ORIGINAL");
  const width = originalFile?.width || previewFile?.width;
  const height = originalFile?.height || previewFile?.height;

  return (
    <Card>
      <CardContent>
        <div className="relative aspect-4/3 bg-muted rounded-2xl overflow-hidden group shadow-xs">
          <Image
            src={previewFile?.url || "/placeholder.jpg"}
            alt={stock?.title || "stock preview"}
            width={width}
            height={height}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 rounded-2xl"
          />

          {/* Crown Icon (Top Left) */}
          <div className="absolute top-2 left-2">
            {stock?.isPremium && (
              <div className="bg-gray-600/80 backdrop-blur-sm p-1.5 rounded-md text-orange-400">
                <Crown className="w-4 h-4 fill-orange-400" />
              </div>
            )}
          </div>

          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center cursor-pointer group-hover:scale-105 rounded-lg"
            onClick={() => setIsZoomOpen(true)}
          >
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full shadow-lg border border-white/30 text-white">
              <ZoomIn className="w-6 h-6" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockPreview;
