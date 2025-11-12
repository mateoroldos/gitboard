import { createFileRoute, notFound } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { convexAction, convexQuery } from "@convex-dev/react-query";
import { CanvasPage } from "@/components/canvas/CanvasPage";

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

    context.queryClient.prefetchQuery(
      convexQuery(api.widgets.getWidgetsByBoard, {
        boardId: context.board._id,
      }),
    );

    return {
      board: context.board,
      hasWriteAccess,
    };
  },
  component: Canvas,
});

function Canvas() {
  const { board, hasWriteAccess } = Route.useLoaderData();
  const { owner, name } = Route.useParams();

  return (
    <CanvasPage
      owner={owner}
      name={name}
      board={board}
      hasWriteAccess={hasWriteAccess}
    />
  );
}
