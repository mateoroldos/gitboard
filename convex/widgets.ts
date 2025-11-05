import { query, internalMutation, action } from "./_generated/server";
import { v } from "convex/values";
import { requireRepoAccess } from "./authHelpers";
import { api, internal } from "./_generated/api";

export const getWidgetsByBoard = query({
  args: {
    boardId: v.id("boards"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("widgets")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .order("asc")
      .collect();
  },
});

export const getWidgetById = query({
  args: {
    widgetId: v.id("widgets"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.widgetId);
  },
});

const createWidgetArgs = {
  boardId: v.id("boards"),
  widgetType: v.union(
    v.literal("github-stars"),
    v.literal("github-issues"),
    v.literal("github-prs"),
    v.literal("github-commits"),
    v.literal("npm-downloads"),
    v.literal("text-note"),
    v.literal("link-collection"),
  ),
  config: v.any(),
  position: v.object({
    x: v.number(),
    y: v.number(),
  }),
  size: v.object({
    width: v.number(),
    height: v.number(),
  }),
  title: v.optional(v.string()),
};

export const createWidget = internalMutation({
  args: createWidgetArgs,
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("widgets", {
      boardId: args.boardId,
      widgetType: args.widgetType,
      config: args.config,
      position: args.position,
      size: args.size,
      title: args.title,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const createWidgetAction = action({
  args: createWidgetArgs,
  handler: async (ctx, args) => {
    const board = await ctx.runQuery(api.boards.getBoardById, {
      boardId: args.boardId,
    });

    if (!board) {
      throw new Error("Board not found");
    }

    await requireRepoAccess(ctx, board.repo);

    await ctx.runMutation(internal.widgets.createWidget, {
      ...args,
    });
  },
});

const updateWidgetArgs = {
  id: v.id("widgets"),
  config: v.optional(v.any()),
  position: v.optional(
    v.object({
      x: v.number(),
      y: v.number(),
    }),
  ),
  size: v.optional(
    v.object({
      width: v.number(),
      height: v.number(),
    }),
  ),
  title: v.optional(v.string()),
};

export const updateWidget = internalMutation({
  args: updateWidgetArgs,
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined),
    );

    if (Object.keys(filteredUpdates).length === 0) {
      return null; // No updates to apply
    }

    return await ctx.db.patch(id, {
      ...filteredUpdates,
      updatedAt: Date.now(),
    });
  },
});

export const updateWidgetAction = action({
  args: updateWidgetArgs,
  handler: async (ctx, args) => {
    const widget = await ctx.runQuery(api.widgets.getWidgetById, {
      widgetId: args.id,
    });

    if (!widget) {
      throw new Error("Widget not found");
    }

    const board = await ctx.runQuery(api.boards.getBoardById, {
      boardId: widget.boardId,
    });

    if (!board) {
      throw new Error("Board not found");
    }

    await requireRepoAccess(ctx, board.repo);

    await ctx.runMutation(internal.widgets.updateWidget, {
      ...args,
    });
  },
});

const deleteWidgetArgs = {
  id: v.id("widgets"),
};

export const deleteWidget = internalMutation({
  args: deleteWidgetArgs,
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const deleteWidgetAction = action({
  args: deleteWidgetArgs,
  handler: async (ctx, args) => {
    const widget = await ctx.runQuery(api.widgets.getWidgetById, {
      widgetId: args.id,
    });

    if (!widget) {
      throw new Error("Widget not found");
    }

    const board = await ctx.runQuery(api.boards.getBoardById, {
      boardId: widget.boardId,
    });

    if (!board) {
      throw new Error("Board not found");
    }

    await requireRepoAccess(ctx, board.repo);

    await ctx.runMutation(internal.widgets.deleteWidget, {
      ...args,
    });
  },
});
