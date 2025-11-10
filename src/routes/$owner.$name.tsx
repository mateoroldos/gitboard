import { Suspense } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { convexAction, convexQuery } from "@convex-dev/react-query";
import { WidgetSelector } from "@/components/widgets/WidgetSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Github } from "lucide-react";
import { BoardWidgets } from "@/components/BoardWidgets";
import { GridSkeleton } from "@/components/ui/grid-skeleton";

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

    await context.queryClient.ensureQueryData(
      convexAction(api.auth.checkRepoWriteAccess, { repo: `${owner}/${name}` }),
    );

    return {
      board: context.board,
    };
  },
  component: RepoBoard,
});

function RepoBoard() {
  const { board } = Route.useLoaderData();

  const { owner, name } = Route.useParams();
  const repoString = `${owner}/${name}`;

  return (
    <>
      <nav className="py-3 flex flex-row justify-between container mx-auto">
        <a href={`https://github.com/${repoString}`} target="_blank">
          <Card className="py-2 group hover:border-primary/40 transition-all">
            <CardContent className="flex flex-row items-center gap-2 text-sm px-3">
              <Github className="size-4 text-muted-foreground/70 group-hover:text-primary transition-all" />
              <h1 className="font-semibold">{repoString}</h1>
            </CardContent>
          </Card>
        </a>

        <Suspense fallback={<div>loading</div>}>
          <WidgetSelector repoString={repoString} />
        </Suspense>
      </nav>

      <main className="h-screen w-screen fixed top-0">
        <Suspense
          fallback={
            <div className="container mx-auto min-h-screen flex flex-1 items-center">
              <GridSkeleton count={6} />
            </div>
          }
        >
          <BoardWidgets boardId={board._id} repoString={repoString} />
        </Suspense>
      </main>
    </>
  );
}
