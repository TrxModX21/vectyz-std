import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Bookmark,
  Crown,
  Download,
  Flag,
  Heart,
  Info,
  MoreVerticalIcon,
  Share2,
  ZoomIn,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "../ui/carousel";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FullImageDialog } from "./full-image-dialog";
import { useState } from "react";
import { useGetRelatedStock } from "@/hooks/use-stock";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import DownloadButton from "./download-button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stock: Stock;
  onStockSelect?: (stock: Stock) => void;
}

const DesktopDialog = ({ open, onOpenChange, stock, onStockSelect }: Props) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const { data: relatedStocks } = useGetRelatedStock(stock?.id ?? "", 10);
  const related = relatedStocks?.stocks || [];

  if (!stock) return null;

  const previewFile = stock.files.find((f) => f.purpose === "PREVIEW");

  const originalFile = stock.files.find((f) => f.purpose === "ORIGINAL");
  const width = originalFile?.width || previewFile?.width;
  const height = originalFile?.height || previewFile?.height;
  const format = (
    originalFile?.format ||
    stock.fileType?.name ||
    "JPG"
  ).toUpperCase();

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="min-w-6xl max-h-[85%]"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="sr-only">{stock.title}</DialogTitle>
            <DialogDescription className="sr-only">
              {stock.description}
            </DialogDescription>
          </DialogHeader>

          <div className="flex h-full overflow-y-auto">
            {/* Left side: image && related stock*/}
            <div className="flex flex-col w-[60%]">
              <div className="w-full bg-zinc-200 max-h-[65%] rounded-lg flex items-center justify-center p-8 relative">
                <div className="relative w-full h-full flex items-center justify-center rounded-lg shadow-sm group">
                  <Image
                    src={previewFile?.url || "placeholder.jpg"}
                    alt={stock.title}
                    width={800}
                    height={600}
                    className="object-cover max-h-full max-w-full transition-transform duration-500 group-hover:scale-105 rounded-lg"
                    priority
                  />

                  {/* Crown Icon (Top Left) */}
                  <div className="absolute top-2 left-2">
                    {stock.isPremium && (
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
              </div>

              {related.length > 0 && (
                <div className="p-4">
                  <h4 className="font-semibold text-zinc-900 text-sm mb-3">
                    You might also like
                  </h4>

                  <Carousel
                    opts={{
                      align: "start",
                    }}
                    className="w-full"
                  >
                    <CarouselContent>
                      {related.map((r) => {
                        const relatedPreview = r.files.find(
                          (f) => f.purpose === "PREVIEW",
                        )?.url;

                        return (
                          <CarouselItem
                            key={r.id}
                            className="basis-1/2 lg:basis-1/5 pl-3"
                          >
                            <div
                              className="w-full aspect-3/4 rounded-xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800 relative group cursor-pointer hover:shadow-md transition-all"
                              onClick={() =>
                                onStockSelect?.(r as unknown as Stock)
                              }
                            >
                              <Image
                                src={relatedPreview || "/placeholder.jpg"}
                                alt={r.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                    <CarouselNext className="bg-v-green rounded-full size-8 -right-3" />
                  </Carousel>
                </div>
              )}
            </div>

            {/* Right side: stock metadata */}
            <div className="w-[40%] px-8 flex flex-col bg-white">
              {/* Header / Top Section */}
              <div className="shrink-0">
                <div className="flex items-start mb-6">
                  <div className="flex gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full"
                        >
                          <MoreVerticalIcon className="w-5 h-5 text-zinc-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" sideOffset={-25}>
                        <DropdownMenuGroup className="p-4">
                          <DropdownMenuItem>
                            <Flag />
                            Report Content
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 />
                            Share
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart
                        className={cn(
                          "w-5 h-5",
                          isLiked
                            ? "fill-red-500 text-red-500"
                            : "text-zinc-500",
                        )}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Bookmark className="w-5 h-5 text-zinc-500" />
                    </Button>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          <Info className="w-5 h-5 text-zinc-500" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="bottom"
                        align="end"
                        className="w-[320px] p-0 overflow-hidden bg-background text-foreground shadow-xl rounded-xl"
                      >
                        <div className="p-5">
                          <h3 className="text-xs font-bold text-zinc-500 uppercase mb-4 tracking-wider">
                            Information
                          </h3>

                          {stock.isPremium && (
                            <div className="flex items-center gap-2 mb-4 text-amber-500">
                              <Crown className="w-5 h-5 fill-amber-500" />
                              <span className="font-bold text-sm">
                                Premium photo
                              </span>
                            </div>
                          )}

                          <div className="space-y-4 text-[13px]">
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400 font-medium">
                                License:
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-zinc-800">
                                  {stock.isPremium ? "Premium" : "Free"}
                                </span>
                                <a
                                  href="#"
                                  className="text-blue-500 hover:text-blue-400 font-medium"
                                >
                                  More info
                                </a>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400 font-medium">
                                Dimension:
                              </span>
                              <span className="font-bold text-zinc-800">
                                {width}px x {height}px
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400 font-medium">
                                Format:
                              </span>
                              <span className="font-bold text-zinc-800">
                                {format}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400 font-medium">
                                Attribution:
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-zinc-800">
                                  Required
                                </span>
                                <a
                                  href="#"
                                  className="text-blue-500 hover:text-blue-400 font-medium"
                                >
                                  How to attribute?
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 mb-8">
                  <Avatar className="h-12 w-12 border border-zinc-200 dark:border-zinc-800">
                    <AvatarImage
                      src={stock.user.image || ""} // Use empty string if null/undefined so fallback shows
                      alt={stock.user.name}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {stock.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                      {stock.user.name}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400 text-xs">
                      1562 Resources
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto rounded-full h-8 text-xs px-4"
                  >
                    Follow
                  </Button>
                </div>

                <h2 className="text-sm text-zinc-600 pr-8 truncate">
                  {stock.title}
                </h2>

                <div className="space-y-3 my-6">
                  <DownloadButton stock={stock} />
                  
                  <Button
                    size="lg"
                    className="w-full font-semibold rounded-lg transition-colors h-12"
                  >
                    Buy me a coffee
                  </Button>
                </div>

                {/* <div className="w-full h-full border-2 border-zinc-800 border-dashed flex items-center justify-center">
                  <div
                    className="cm-product-widget"
                    data-pid="7522108"
                    data-uid="9178684"
                  >
                    Loading Preview...
                  </div>
                  <span className="cm-product-powered-by">
                    Powered by{" "}
                    <a href="https://creativemarket.com?utm_campaign=cwcm%20collection%20embed">
                      Creative Market
                    </a>
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <FullImageDialog
        previewUrl={previewFile?.url || "/placeholder.jpg"}
        title={stock.title}
        description={stock.description}
        open={isZoomOpen}
        onOpenChange={setIsZoomOpen}
      />
    </>
  );
};

export default DesktopDialog;
