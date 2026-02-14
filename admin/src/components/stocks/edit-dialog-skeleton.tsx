import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";

const EditDialogSkeleton = () => {
  return (
    <>
      <DialogHeader>
        <DialogTitle asChild>
          <Skeleton className="h-10 w-48" />
        </DialogTitle>
        <DialogDescription asChild>
          <Skeleton className="h-4 w-64" />
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 w-3xl mx-auto">
        {/* Preview Image Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-3 w-48" />
        </div>

        {/* Original File Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-[120px] w-full rounded-lg" />
          <Skeleton className="h-3 w-64" />

          {/* Existing Files List Skeleton */}
          <div className="space-y-2 pt-2">
            <Skeleton className="h-3 w-20" />
            <div className="space-y-2">
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-32 w-full" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Category Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* File Type Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Keywords Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>

        {/* Premium Switch Skeleton */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>

        {/* Buttons Skeleton */}
        <div className="flex justify-end gap-4 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </>
  );
};

export default EditDialogSkeleton;
