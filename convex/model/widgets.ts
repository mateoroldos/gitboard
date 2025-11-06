import { Id } from "convex/_generated/dataModel";
import { MutationCtx, QueryCtx } from "convex/_generated/server";
import { ConvexError } from "convex/values";

export async function getWidgetsByBoard(
  ctx: QueryCtx,
  { boardId }: { boardId: Id<"boards"> },
) {
  return await ctx.db
    .query("widgets")
    .withIndex("by_board", (q) => q.eq("boardId", boardId))
    .order("asc")
    .collect();
}

export async function getWidgetById(
  ctx: QueryCtx,
  { widgetId }: { widgetId: Id<"widgets"> },
) {
  const widget = await ctx.db.get(widgetId);

  if (!widget) {
    throw new ConvexError({
      message: "Widget not found",
      code: 404,
    });
  }

  return widget;
}

export async function createWidget(
  ctx: MutationCtx,
  {
    boardId,
    widgetType,
    config,
    position,
    size,
    title,
  }: {
    boardId: Id<"boards">;
    widgetType: string;
    config: any;
    position: { x: number; y: number };
    size: { width: number; height: number };
    title?: string;
  },
) {
  const now = Date.now();

  return await ctx.db.insert("widgets", {
    boardId,
    widgetType,
    config,
    position,
    size,
    title,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateWidget(
  ctx: MutationCtx,
  {
    id,
    config,
    position,
    size,
    title,
  }: {
    id: Id<"widgets">;
    config?: any;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    title?: string;
  },
) {
  const updates = Object.fromEntries(
    Object.entries({ config, position, size, title }).filter(
      ([_, value]) => value !== undefined,
    ),
  );

  if (Object.keys(updates).length === 0) {
    return null;
  }

  return await ctx.db.patch(id, {
    ...updates,
    updatedAt: Date.now(),
  });
}

export async function deleteWidget(
  ctx: MutationCtx,
  { id }: { id: Id<"widgets"> },
) {
  return await ctx.db.delete(id);
}

