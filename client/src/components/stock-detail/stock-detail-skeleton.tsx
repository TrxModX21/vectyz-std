import React from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const StockDetailSkeleton = () => {
  return (
    <section>
      {/* <Header /> */}
      <div className="relative mx-auto container py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent>
                <Skeleton className="w-full aspect-4/3 rounded-2xl" />
              </CardContent>
            </Card>

            <div className="flex items-start justify-between">
              <div className="space-y-3 w-full max-w-md">
                <Skeleton className="h-8 w-3/4" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-2.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[85%]" />
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-6">
            <Card className="border-2 border-primary/10 shadow-lg">
              <CardContent className="p-6 pt-0 space-y-6">
                {/* Stock Action Row */}
                <div className="flex gap-1">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>

                {/* License Info */}
                <Skeleton className="h-12 w-full rounded-lg" />

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <Skeleton className="h-8 w-16 rounded-full shrink-0" />
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <Skeleton className="h-14 w-full rounded-lg" />
                  <Skeleton className="h-3 w-40 mx-auto mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 space-y-4">
                <Skeleton className="h-3 w-24 mb-5" />
                <div className="flex justify-between py-2.5 border-b border-dashed">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between py-2.5 border-b border-dashed">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="flex justify-between py-2.5 border-b border-dashed">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex justify-between py-2.5 border-b border-dashed">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </section>
  );
};

export default StockDetailSkeleton;
