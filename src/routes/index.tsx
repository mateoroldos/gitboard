import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { RecentBoardsGrid } from "@/components/RecentBoardsGrid";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-2">GitBoard</h1>
          <p className="text-muted-foreground text-lg mb-8">
            The open source canvas for open source projects
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Recent Boards</h2>

          <Suspense
            fallback={<GridSkeleton count={6} showDescription showFooter />}
          >
            <RecentBoardsGrid limit={6} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
