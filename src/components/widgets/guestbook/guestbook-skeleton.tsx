import { Skeleton } from "@/components/ui/skeleton";

export function GuestbookSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
        <div className="space-y-8">
          {/* Stats skeleton */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-48 mx-auto" />
            <div className="flex justify-center -space-x-2">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="size-10 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Button skeleton */}
      <Skeleton className="w-full h-10 mt-4" />
    </div>
  );
}