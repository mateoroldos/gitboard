import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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

export const createWidget = mutation({
  args: {
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
  },
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

export const updateWidget = mutation({
  args: {
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
  },
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

export const deleteWidget = mutation({
  args: {
    id: v.id("widgets"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

