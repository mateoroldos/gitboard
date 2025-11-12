import {
  query,
  action,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { v } from "convex/values";
import { requireSession } from "./model/auth";
import { ConvexError } from "convex/values";
import { api, internal } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";

export const getComments = query({
  args: {
    widgetId: v.id("widgets"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (
    ctx,
    { widgetId, paginationOpts },
  ): Promise<{
    page: Array<{
      _id: string;
      comment: string;
      createdAt: number;
      userId: string;
      username: string;
      avatarUrl: string | null;
    }>;
    isDone: boolean;
    continueCursor: string;
  }> => {
    const widget = await ctx.db.get(widgetId);
    if (!widget || widget.widgetType !== "guestbook") {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const results = await ctx.db
      .query("guestbookComments")
      .withIndex("by_widget_created", (q) => q.eq("widgetId", widgetId))
      .order("desc")
      .paginate(paginationOpts);

    const commentsWithUserData = await Promise.all(
      results.page.map(async (comment) => {
        const user = await ctx.runQuery(api.auth.getUserById, {
          id: comment.userId,
        });

        if (!user) {
          return {
            _id: comment._id,
            comment: comment.comment,
            createdAt: comment.createdAt,
            userId: comment.userId,
            username: "Anon",
            avatarUrl: null,
          };
        }

        return {
          _id: comment._id,
          comment: comment.comment,
          createdAt: comment.createdAt,
          userId: comment.userId,
          username: user.name || "Anon",
          avatarUrl: (user.image as string) || null,
        };
      }),
    );

    return {
      page: commentsWithUserData,
      isDone: results.isDone,
      continueCursor: results.continueCursor || "",
    };
  },
});

export const getUserCommentCount = internalQuery({
  args: {
    userId: v.string(),
    widgetId: v.id("widgets"),
  },
  handler: async (ctx, { userId, widgetId }) => {
    const comments = await ctx.db
      .query("guestbookComments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("widgetId"), widgetId))
      .collect();

    return comments.length;
  },
});

export const addCommentInternal = internalMutation({
  args: {
    widgetId: v.id("widgets"),
    userId: v.string(),
    comment: v.string(),
  },
  handler: async (ctx, { widgetId, userId, comment }) => {
    await ctx.db.insert("guestbookComments", {
      widgetId,
      userId,
      comment,
      createdAt: Date.now(),
    });
  },
});

export const addComment = action({
  args: {
    widgetId: v.id("widgets"),
    comment: v.string(),
  },
  handler: async (ctx, { widgetId, comment }) => {
    await requireSession(ctx);
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity!.subject;

    if (comment.trim().length === 0) {
      throw new ConvexError({
        message: "Comment cannot be empty",
        code: 400,
      });
    }

    if (comment.length > 280) {
      throw new ConvexError({
        message: "Comment must be 280 characters or less",
        code: 400,
      });
    }

    const userCommentCount = await ctx.runQuery(
      internal.guestbook.getUserCommentCount,
      {
        userId,
        widgetId,
      },
    );

    if (userCommentCount >= 5) {
      throw new ConvexError({
        message: "You have reached the maximum of 5 comments",
        code: 400,
      });
    }

    await ctx.runMutation(internal.guestbook.addCommentInternal, {
      widgetId,
      userId,
      comment: comment.trim(),
    });
  },
});

export const checkUserCanComment = query({
  args: {
    widgetId: v.id("widgets"),
  },
  handler: async (ctx, { widgetId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { canComment: false, commentCount: 0 };
    }

    const userId = identity.subject;
    const comments = await ctx.db
      .query("guestbookComments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("widgetId"), widgetId))
      .collect();

    return {
      canComment: comments.length < 5,
      commentCount: comments.length,
    };
  },
});
