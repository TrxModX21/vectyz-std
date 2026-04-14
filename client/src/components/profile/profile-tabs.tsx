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
import StockCard from "./stock-card";

type Props = {
  stocks: Stock[];
  user: Vectyzen;
  totalCount: number;
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
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: Props) => {
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
                <div className="columns-1 lg:columns-2 xl:columns-3 gap-4 space-y-4">
                  {stocks.map((asset, index) => (
                    <FadeIn key={asset.id} delay={index * 0.05}>
                      <StockCard stock={asset} />
                    </FadeIn>
                  ))}
                </div>

                {hasNextPage && (
                  <div className="flex justify-center pt-8 pb-4">
                    <Button
                      variant="outline"
                      className="rounded-full px-8"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? <LoaderOne /> : "Load more"}
                    </Button>
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
