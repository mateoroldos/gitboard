import { createFileRoute, notFound } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { convexAction, convexQuery } from "@convex-dev/react-query";
import { CanvasPage } from "@/components/canvas/CanvasPage";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const repoString = `mateoroldos/gitboard`;

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
  loader: async ({ context }) => {
    if (!context.board) {
      throw notFound();
    }

    const owner = "mateoroldos";
    const name = "gitboard";

    const hasWriteAccess = await context.queryClient.ensureQueryData(
      convexAction(api.auth.checkRepoWriteAccess, { repo: `${owner}/${name}` }),
    );

    context.queryClient.prefetchQuery(
      convexQuery(api.widgets.getWidgetsByBoard, {
        boardId: context.board._id,
      }),
    );

    return {
      owner,
      name,
      board: context.board,
      hasWriteAccess,
    };
  },
  component: Canvas,
});

function Canvas() {
  const { owner, name, board, hasWriteAccess } = Route.useLoaderData();

  return (
    <CanvasPage
      owner={owner}
      name={name}
      board={board}
      hasWriteAccess={hasWriteAccess}
    />
  );
}
