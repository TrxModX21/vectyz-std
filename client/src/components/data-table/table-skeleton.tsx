import { Skeleton } from "../ui/skeleton";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

const TableSkeleton = ({ columns, rows = 20 }: TableSkeletonProps) => {
  return (
    <div className="rounded-md border">
      {/* Table Header Skeleton */}
      <div className="flex h-10 rounded-t-lg">
        {[...Array(columns)].map((_, index) => (
          <div key={`header-col-${index}`} className={`flex-1 px-4 py-2`}>
            <Skeleton className="h-4 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table Body Skeleton */}
      <div className="divide-y">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex h-10">
            {[...Array(columns)].map((_, colIndex) => (
              <div
                key={`row-${rowIndex}-col-${colIndex}`}
                className={`flex-1 px-4 py-2`}
              >
                <Skeleton className="h-4 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
