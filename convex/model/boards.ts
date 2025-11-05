import { Id } from "convex/_generated/dataModel";
import { MutationCtx, QueryCtx } from "convex/_generated/server";

export async function getBoardById(
  ctx: QueryCtx,
  { boardId }: { boardId: Id<"boards"> },
) {
  return await ctx.db.get(boardId);
}

export async function getBoardByRepo(
  ctx: QueryCtx,
  { repo }: { repo: string },
) {
  return await ctx.db
    .query("boards")
    .withIndex("by_repo", (q) => q.eq("repo", repo))
    .first();
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
    return existing._id;
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
