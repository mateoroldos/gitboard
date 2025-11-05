import {
  query,
  internalMutation,
  action,
  internalQuery,
} from "./_generated/server";
import { v } from "convex/values";
import { requireRepoAccess } from "./model/auth";
import { api, internal } from "./_generated/api";
import * as Widgets from "./model/widgets";
import * as Boards from "./model/boards";

export const getWidgetsByBoard = query({
  args: {
    boardId: v.id("boards"),
  },
  handler: async (ctx, { boardId }) => {
    return await Widgets.getWidgetsByBoard(ctx, { boardId });
  },
});

export const getWidgetById = query({
  args: {
    widgetId: v.id("widgets"),
  },
  handler: async (ctx, { widgetId }) => {
    return await Widgets.getWidgetById(ctx, { widgetId });
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
    return await Widgets.createWidget(ctx, args);
  },
});

export const createWidgetAction = action({
  args: createWidgetArgs,
  handler: async (ctx, args) => {
    const board = await ctx.runQuery(api.boards.getBoardById, {
      boardId: args.boardId,
    });

    await requireRepoAccess(ctx, board.repo);

    await ctx.runMutation(internal.widgets.createWidget, {
      ...args,
    });
  },
});

export const getWidgetWithBoard = internalQuery({
  args: {
    widgetId: v.id("widgets"),
  },
  handler: async (ctx, { widgetId }) => {
    const widget = await Widgets.getWidgetById(ctx, { widgetId });
    const board = await Boards.getBoardById(ctx, { boardId: widget.boardId });

    return {
      ...widget,
      board,
    };
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
    return await Widgets.updateWidget(ctx, args);
  },
});

export const updateWidgetAction = action({
  args: updateWidgetArgs,
  handler: async (ctx, args) => {
    const widget = await ctx.runQuery(internal.widgets.getWidgetWithBoard, {
      widgetId: args.id,
    });

    await requireRepoAccess(ctx, widget.board.repo);

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
    return await Widgets.deleteWidget(ctx, args);
  },
});

export const deleteWidgetAction = action({
  args: deleteWidgetArgs,
  handler: async (ctx, args) => {
    const widget = await ctx.runQuery(internal.widgets.getWidgetWithBoard, {
      widgetId: args.id,
    });

    await requireRepoAccess(ctx, widget.board.repo);

    await ctx.runMutation(internal.widgets.deleteWidget, {
      ...args,
    });
  },
});
