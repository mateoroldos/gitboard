import { Suspense, useRef } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { convexAction, convexQuery } from "@convex-dev/react-query";
import { WidgetSelector } from "@/components/widgets/WidgetSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Github } from "lucide-react";
import { BoardWidgets } from "@/components/BoardWidgets";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { CanvasProvider, useCanvasContext } from "@/components/CanvasContext";
import { CanvasControls } from "@/components/CanvasControls";

export const Route = createFileRoute("/$owner/$name")({
  beforeLoad: async ({ params, context }) => {
    const { owner, name } = params;
    const repoString = `${owner}/${name}`;

    try {
      const board = await context.queryClient.ensureQueryData(
        convexQuery(api.boards.getBoardByRepo, { repo: repoString }),
      );

      return { board };
    } catch {
      return {
        board: null,
      };
    }
  },
  loader: async ({ context, params }) => {
    if (!context.board) {
      throw notFound();
    }

    const { owner, name } = params;

    const hasWriteAccess = await context.queryClient.ensureQueryData(
      convexAction(api.auth.checkRepoWriteAccess, { repo: `${owner}/${name}` }),
    );

    return {
      board: context.board,
      hasWriteAccess,
    };
  },
  component: RepoBoard,
});

function CanvasContainer() {
  const { canvasRef, viewport } = useCanvasContext();

  return (
    <div
      ref={canvasRef}
      className="h-screen w-screen absolute top-0 left-0 overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, oklch(from var(--muted-foreground) l c h / 0.25) 1px, transparent 0)`,
        backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`,
        backgroundPosition: `${viewport.x * viewport.zoom}px ${viewport.y * viewport.zoom}px`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Suspense
          fallback={
            <div className="container mx-auto min-h-screen flex flex-1 items-center">
              <GridSkeleton count={6} />
            </div>
          }
        >
          <BoardWidgets />
        </Suspense>
      </div>
    </div>
  );
}

function RepoBoard() {
  const { board, hasWriteAccess } = Route.useLoaderData();

  const { owner, name } = Route.useParams();
  const repoString = `${owner}/${name}`;

  return (
    <CanvasProvider
      boardId={board._id}
      repoString={repoString}
      hasWriteAccess={hasWriteAccess}
    >
      <nav className="py-3 flex flex-row justify-between container mx-auto relative z-10">
        <a href={`https://github.com/${repoString}`} target="_blank">
          <Card className="py-2 group hover:border-primary/40 transition-all">
            <CardContent className="flex flex-row items-center gap-2 text-sm px-3">
              <Github className="size-4 text-muted-foreground/70 group-hover:text-primary transition-all" />
              <h1 className="font-semibold">{repoString}</h1>
            </CardContent>
          </Card>
        </a>

        {hasWriteAccess && <WidgetSelector />}
      </nav>

      <main>
        <CanvasContainer />
        <CanvasControls />
      </main>
    </CanvasProvider>
  );
}
