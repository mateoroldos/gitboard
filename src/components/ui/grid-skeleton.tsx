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
        <Card key={i} className={cardClassName}>
          <CardHeader>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </CardHeader>
          <CardContent>
            {showDescription && <Skeleton className="h-3 w-full mb-4" />}
            {showFooter && (
              <div className="flex justify-between items-center">
                <Skeleton className="h-2 w-1/3" />
                <Skeleton className="h-6 w-20" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

