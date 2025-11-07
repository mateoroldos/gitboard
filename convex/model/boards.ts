import { Id } from "convex/_generated/dataModel";
import { MutationCtx, QueryCtx } from "convex/_generated/server";
import { ConvexError } from "convex/values";

export async function getBoardById(
  ctx: QueryCtx,
  { boardId }: { boardId: Id<"boards"> },
) {
  const board = await ctx.db.get(boardId);

  if (!board) {
    throw new ConvexError({
      message: "Board not found",
      code: 404,
    });
  }

  return board;
}

export async function getBoardByRepo(
  ctx: QueryCtx,
  { repo }: { repo: string },
) {
  const board = await ctx.db
    .query("boards")
    .withIndex("by_repo", (q) => q.eq("repo", repo))
    .first();

  if (!board) {
    throw new ConvexError({
      message: "Board not found",
      code: 404,
    });
  }

  return board;
}

export async function getRecentBoards(
  ctx: QueryCtx,
  { limit = 10 }: { limit?: number } = {},
) {
  return await ctx.db
    .query("boards")
    .order("desc")
    .take(limit);
}

export async function createBoard(
  ctx: MutationCtx,
  {
    name,
    repo,
    description,
  }: { name: string; repo: string; description: string | undefined },
) {
  const existing = await ctx.db
    .query("boards")
    .withIndex("by_repo", (q) => q.eq("repo", repo))
    .first();

  if (existing) {
    throw new ConvexError({
      message: "Board already exists",
      code: 409,
    });
  }

  const now = Date.now();
  return await ctx.db.insert("boards", {
    name,
    repo,
    description,
    createdAt: now,
    updatedAt: now,
  });
}
