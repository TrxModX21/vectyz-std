import { useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import EmptyState from "../common/empty-state";
import FadeIn from "../common/fade-in";
import { Button } from "../ui/button";
import { NativeTabs } from "../uitripled/native-tabs-shadcnui";
import { LoaderOne } from "../ui/loader";
import { ColumnsPhotoAlbum, RenderImageProps } from "react-photo-album";
import "react-photo-album/columns.css";
import StockCard from "../common/stock-card";

type Props = {
  stocks: Stock[];
  user: Vectyzen;
  totalCount: number;
  pageCount: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<GetAllStockResponse, unknown>,
      Error
    >
  >;
};

const ProfileTabs = ({
  stocks,
  user,
  totalCount,
  pageCount,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: Props) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && pageCount < 4) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, pageCount, fetchNextPage]);
  const photos = stocks.map((stock) => {
    const preview = stock.files.find((f) => f.purpose === "PREVIEW")!;
    return {
      src: preview.url,
      width: preview.width || 800,
      height: preview.height || 600,
      alt: stock.title,
      key: stock.id,
      stockData: stock,
    };
  });

  const renderPhoto = (imageProps: RenderImageProps, context: any) => {
    return (
      <StockCard
        stock={context.photo.stockData}
        style={{ width: "100%", height: "100%" }}
      />
    );
  };

  return (
    <NativeTabs
      defaultValue="assets"
      items={[
        {
          id: "assets",
          label: `Assets (${totalCount})`,
          content:
            stocks.length > 0 ? (
              <>
                <div className="space-y-4 space-x-4">
                  <FadeIn className="space-x-4 space-y-4">
                    <ColumnsPhotoAlbum
                      photos={photos}
                      columns={(containerWidth) => {
                        if (containerWidth < 428) return 1;
                        if (containerWidth < 900) return 2;
                        return 3;
                      }}
                      render={{ image: renderPhoto }}
                      spacing={16}
                    />
                  </FadeIn>
                </div>

                {hasNextPage && (
                  <div className="flex justify-center pt-8 pb-4">
                    {pageCount < 4 ? (
                      <div ref={ref} className="w-full h-10 flex justify-center items-center">
                        {isFetchingNextPage && <LoaderOne />}
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="rounded-full px-8"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                      >
                        {isFetchingNextPage ? <LoaderOne /> : "Load more"}
                      </Button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <EmptyState />
            ),
        },
        {
          id: "collections",
          label: `Collections (${user?.totalCollections})`,
          content: (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
              <h3 className="text-2xl font-bold text-muted-foreground">
                Collections Coming Soon
              </h3>
              <p className="text-muted-foreground mt-2">
                This user hasn't curated any public collections yet.
              </p>
            </div>
          ),
        },
      ]}
    />
  );
};

export default ProfileTabs;
