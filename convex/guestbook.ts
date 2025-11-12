import {
  query,
  action,
  internalMutation,
  internalQuery,
  mutation,
} from "./_generated/server";
import { v } from "convex/values";
import { requireSession, requireRepoAccess } from "./model/auth";
import { ConvexError } from "convex/values";
import { internal } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";
import * as Guestbook from "./model/guestbook";

export const getComments = query({
  args: {
    widgetId: v.id("widgets"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { widgetId, paginationOpts }) => {
    return await Guestbook.getComments(ctx, { widgetId, paginationOpts });
  },
});

export const getUserCommentCount = internalQuery({
  args: {
    userId: v.string(),
    widgetId: v.id("widgets"),
  },
  handler: async (ctx, { userId, widgetId }) => {
    return await Guestbook.getUserCommentCount(ctx, { userId, widgetId });
  },
});

export const addCommentInternal = internalMutation({
  args: {
    widgetId: v.id("widgets"),
    userId: v.string(),
    comment: v.string(),
  },
  handler: async (ctx, { widgetId, userId, comment }) => {
    await Guestbook.addComment(ctx, { widgetId, userId, comment });
  },
});

export const addComment = mutation({
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

export const deleteCommentInternal = internalMutation({
  args: {
    commentId: v.id("guestbookComments"),
  },
  handler: async (ctx, { commentId }) => {
    await Guestbook.deleteComment(ctx, { commentId });
  },
});

export const deleteComment = action({
  args: {
    commentId: v.id("guestbookComments"),
  },
  handler: async (ctx, { commentId }) => {
    await requireSession(ctx);

    // Get the repo for this comment to check permissions
    const repo = await ctx.runQuery(internal.guestbook.getCommentRepo, {
      commentId,
    });

    if (!repo) {
      throw new ConvexError({
        message: "Comment not found",
        code: 404,
      });
    }

    // Check if user has write access to the repo
    await requireRepoAccess(ctx, repo);

    // Delete the comment
    await ctx.runMutation(internal.guestbook.deleteCommentInternal, {
      commentId,
    });
  },
});

export const getCommentById = internalQuery({
  args: {
    commentId: v.id("guestbookComments"),
  },
  handler: async (ctx, { commentId }) => {
    return await Guestbook.getCommentById(ctx, { commentId });
  },
});

export const getCommentRepo = internalQuery({
  args: {
    commentId: v.id("guestbookComments"),
  },
  handler: async (ctx, { commentId }) => {
    return await Guestbook.getCommentRepo(ctx, { commentId });
  },
});

export const getGuestbookStats = query({
  args: {
    widgetId: v.id("widgets"),
  },
  handler: async (ctx, { widgetId }) => {
    return await Guestbook.getGuestbookStats(ctx, { widgetId });
  },
});

export const checkUserCanComment = query({
  args: {
    widgetId: v.id("widgets"),
  },
  handler: async (ctx, { widgetId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { canComment: false, commentCount: 0, canDelete: false };
    }

    const userId = identity.subject;
    return await Guestbook.checkUserCanComment(ctx, { userId, widgetId });
  },
});
