"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, FileIcon, Eye, Heart } from "lucide-react";
import { handleDownload } from "@/lib/helpers";
import Link from "next/link";

interface StockDetailsSheetProps {
  stock: Stock | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StockDetailsSheet({
  stock,
  open,
  onOpenChange,
}: StockDetailsSheetProps) {
  const isMobile = useIsMobile();

  if (!stock) return null;

  const thumbnail = stock.files.find((f: File) => f.purpose === "PREVIEW")?.url;
  const originals = stock.files.filter((f: any) => f.purpose === "ORIGINAL");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={
          isMobile ? "h-[85vh] p-0" : "w-full max-w-md sm:max-w-lg p-0 border-l"
        }
      >
        <div className="h-full w-full overflow-y-auto">
          <div className="flex flex-col gap-6 p-6">
            <SheetHeader className="text-left">
              <SheetTitle className="text-xl font-bold leading-tight">
                {stock.title}
              </SheetTitle>
              <SheetDescription>
                {stock.category.name} • {stock.fileType.name}
              </SheetDescription>
            </SheetHeader>

            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt={stock.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  No Preview Available
                </div>
              )}
              {stock.isPremium && (
                <Badge className="absolute right-2 top-2" variant="default">
                  Premium
                </Badge>
              )}
            </div>

            {/* Status & Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Status:
                </span>
                <Badge
                  variant={
                    stock.status === "APPROVED"
                      ? "default"
                      : stock.status === "PENDING"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {stock.status}
                </Badge>
              </div>
              <div className="text-lg font-bold">
                {stock.isPremium
                  ? new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(Number(stock.price))
                  : "Free"}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-lg border bg-muted/50 p-2">
              <div className="flex flex-col items-center justify-center gap-1 p-2 text-center">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="size-4" />
                  <span className="text-xs font-medium">Views</span>
                </div>
                <span className="text-lg font-bold">
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                  }).format(stock.totalViews || 0)}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-x border-muted-foreground/10 p-2 text-center">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Download className="size-4" />
                  <span className="text-xs font-medium">Downloads</span>
                </div>
                <span className="text-lg font-bold">
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                  }).format(stock.totalDownloads || 0)}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 p-2 text-center">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Heart className="size-4" />
                  <span className="text-xs font-medium">Likes</span>
                </div>
                <span className="text-lg font-bold">
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                  }).format(stock.totalLikes || 0)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium leading-none">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {stock.description || "No description provided."}
              </p>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium leading-none">Keywords</h4>
              <div className="flex flex-wrap gap-1">
                {stock.keywords.map((keyword: string) => (
                  <Badge key={keyword} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Files */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium leading-none">
                Original Files
              </h4>
              <div className="grid gap-2">
                {originals.map((file: File, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition-colors w-full"
                  >
                    <div className="flex items-center gap-3 overflow-hidden min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-muted">
                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                      </div>

                      <div className="flex flex-col overflow-hidden min-w-0 flex-1">
                        <span className="text-sm font-medium">
                          {file.publicId.split("/").pop()}
                        </span>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="uppercase">{file.format}</span>
                          <span>•</span>
                          <span>
                            {(file.bytes / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(file.publicId)}
                      className="shrink-0 h-8 w-8"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Uploader Meta */}
            {stock.user ? (
              <Link
                href={`/manage-users/${stock.user.id}`}
                className="flex items-center gap-3 rounded-lg border p-4 bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                  {stock.user.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    Uploaded by {stock.user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(stock.createdAt).toLocaleDateString("id-ID", {
                      dateStyle: "long",
                    })}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border p-4 bg-muted/20">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                  ?
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    Uploaded by Unknown User
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(stock.createdAt).toLocaleDateString("id-ID", {
                      dateStyle: "long",
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
