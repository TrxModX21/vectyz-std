"use client";

import Footer from "@/components/common/footer";
import Header from "@/components/explore/file-type/header";
import { useGetVectyzenDetail } from "@/hooks/use-vectyzen";
import { notFound, useParams } from "next/navigation";
import { useInfiniteGetStockByUser } from "@/hooks/use-stock";
import ProfilePageSkeleton from "@/components/profile/profile-page-skeleton";
import ProfileBanner from "@/components/profile/profile-banner";
import ProfileInformation from "@/components/profile/profile-information";
import ProfileStats from "@/components/profile/profile-stats";
import ProfileTabs from "@/components/profile/profile-tabs";

const ProfilePage = () => {
  const params = useParams();
  const username = params.username as string;

  const { data: userDataResponse, isLoading: userDataLoading } =
    useGetVectyzenDetail(username);
  const user: Vectyzen | undefined = userDataResponse?.user;
  const profile: Profile | undefined = user?.profile;

  const {
    data: stockDataResponse,
    isLoading: stockDataLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteGetStockByUser(user?.id || "", {});

  const stocks: Stock[] =
    stockDataResponse?.pages.flatMap((page: any) => page.stocks) || [];
  const stockCount = stockDataResponse?.pages[0].totalCount || 0;
  const pageCount = stockDataResponse?.pages.length || 0;

  const isLoading = userDataLoading || stockDataLoading;

  if (!user && !isLoading) {
    notFound();
  }

  return (
    <section>
      <Header />
      {isLoading ? (
        <>
          <ProfilePageSkeleton />
        </>
      ) : (
        <div className="bg-background min-h-screen container mx-auto py-4 lg:pb-10 pt-0">
          <ProfileBanner user={user!} />

          <div className="container px-4 md:px-8 max-w-screen-2xl relative -mt-32">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <ProfileInformation user={user!} profile={profile!} />

              <div className="flex-1 w-full pt-10 lg:pt-32">
                <ProfileStats user={user!} stockCount={stockCount} />

                {/* Tabs Content */}
                <ProfileTabs
                  stocks={stocks}
                  user={user!}
                  totalCount={stockCount}
                  pageCount={pageCount}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  fetchNextPage={fetchNextPage}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </section>
  );
};

export default ProfilePage;
