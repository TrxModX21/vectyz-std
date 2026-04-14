import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const ProfilePageSkeleton = () => {
  return (
    <div className="bg-background min-h-screen container mx-auto px-4 lg:px-6 py-4 pt-0">
      {/* Cover */}
      <Skeleton className="h-64 md:h-80 w-full rounded-b-2xl" />

      <div className="container px-4 md:px-8 max-w-screen-2xl relative -mt-32">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            <Skeleton className="h-40 w-40 rounded-full" />

            <div className="space-y-2">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            <div className="flex gap-3 pt-4">
              <Skeleton className="h-12 w-32 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full pt-10 lg:pt-32">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-card border rounded-2xl p-6 shadow-sm">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <Skeleton className="h-8 w-16 mx-auto" />
                  <Skeleton className="h-3 w-20 mx-auto" />
                </div>
              ))}
            </div>

            {/* Tabs header */}
            <div className="flex gap-4 mb-6">
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>

            {/* Masonry grid */}
            <div className="columns-1 lg:columns-2 xl:columns-3 gap-4 space-y-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Card
                  key={i}
                  className="break-inside-avoid rounded-2xl bg-gray-200 py-2"
                >
                  <CardContent className="px-2">
                    <div className="relative rounded-xl overflow-hidden">
                      <Skeleton className="w-full min-h-56 h-[260px] rounded-xl" />

                      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                        <Skeleton className="h-4 w-3/4 bg-white/40" />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-6 rounded-full bg-white/40" />
                            <Skeleton className="h-3 w-16 bg-white/40" />
                          </div>
                          <Skeleton className="h-3 w-10 bg-white/40" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;
