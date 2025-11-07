import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface GridSkeletonProps {
  count?: number;
  className?: string;
  cardClassName?: string;
  showDescription?: boolean;
  showFooter?: boolean;
}

export function GridSkeleton({
  count = 6,
  className,
  cardClassName,
  showDescription = true,
  showFooter = true,
}: GridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className={cn("h-full border-border/50", cardClassName)}>
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-3/4" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-3.5 w-3.5 rounded" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {showDescription && (
              <Skeleton className="h-4 w-full mb-4" />
            )}
            {showFooter && (
              <div className="flex items-center gap-1.5 mt-auto">
                <Skeleton className="h-3 w-3 rounded" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

