"use client";

import FadeIn from "@/components/common/fade-in";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MasonryPhotoAlbum, RenderImageProps } from "react-photo-album";
import "react-photo-album/masonry.css";
import StockCard from "@/components/common/stock-card";
import {
  useCollectionBySlug,
  useCollectionItemsBySlug,
  useRemoveItemFromCollection,
} from "@/hooks/use-collection";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CollectionListDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";

  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: collectionData, isLoading: collectionLoading } =
    useCollectionBySlug(slug);
  const { data: itemsData, isLoading: itemsLoading } = useCollectionItemsBySlug(
    slug,
    { page, limit },
  );

  const { mutate: removeItem } = useRemoveItemFromCollection();

  const handleRemove = (stockId: string) => {
    if (!collectionData?.collection?.id) return;
    removeItem({ collectionId: collectionData.collection.id, stockId });
  };

  const renderPhoto = (imageProps: RenderImageProps, context: any) => {
    return (
      <StockCard
        stock={context.photo.stockData}
        style={{ width: "100%", height: "100%" }}
        customAction={
          <Button
            size="icon"
            variant="destructive"
            className="pointer-events-auto h-8 w-8 rounded-md shadow-sm cursor-pointer opacity-90 hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRemove(context.photo.stockData.id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        }
      />
    );
  };

  const photos =
    itemsData?.items?.map((item: any) => {
      const originalFile = item.stock?.files?.find(
        (f: any) => f.purpose === "ORIGINAL",
      );
      const previewFile = item.stock?.files?.find(
        (f: any) => f.purpose === "PREVIEW",
      );

      return {
        src: previewFile?.url || previewFile?.fileUrl || "",
        width: originalFile?.width || previewFile?.width || 800,
        height: originalFile?.height || previewFile?.height || 600,
        stockData: item.stock,
      };
    }) || [];

  if (collectionLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!collectionData?.collection) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-2">Collection not found</h2>
        <Link
          href="/vectyzen/collections"
          className="text-primary hover:underline"
        >
          Go back to My Collections
        </Link>
      </div>
    );
  }

  const collection = collectionData.collection;

  return (
    <FadeIn>
      <div className="mb-8">
        <Link
          href="/vectyzen/collections"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Collections
        </Link>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-3xl font-bold">{collection.name}</h1>
            <p className="text-muted-foreground mt-2">
              {collection.description ||
                "Manage and view assets in this collection."}
            </p>
          </div>
        </div>
      </div>

      {itemsLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : photos.length > 0 ? (
        <>
          <MasonryPhotoAlbum
            photos={photos}
            columns={(containerWidth) => {
              if (containerWidth < 428) return 1;
              if (containerWidth < 900) return 2;
              if (containerWidth < 1200) return 3;
              return 4;
            }}
            render={{ image: renderPhoto }}
            spacing={16}
          />

          {itemsData?.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {page} of {itemsData.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === itemsData.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-muted/20">
          <h3 className="text-lg font-semibold mb-2">No assets found</h3>
          <p className="text-muted-foreground">This collection is empty.</p>
        </div>
      )}
    </FadeIn>
  );
};

export default CollectionListDetailPage;
