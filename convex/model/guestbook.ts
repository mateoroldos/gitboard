import { QueryCtx, MutationCtx } from '../_generated/server';
import { Id } from '../_generated/dataModel';
import { api } from '../_generated/api';

export async function getComments(
  ctx: QueryCtx,
  { widgetId, paginationOpts }: { 
    widgetId: Id<"widgets">; 
    paginationOpts: any;
  }
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
}> {
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
}

export async function getUserCommentCount(
  ctx: QueryCtx,
  { userId, widgetId }: { userId: string; widgetId: Id<"widgets"> }
) {
  const comments = await ctx.db
    .query("guestbookComments")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .filter((q) => q.eq(q.field("widgetId"), widgetId))
    .collect();

  return comments.length;
}

export async function addComment(
  ctx: MutationCtx,
  { widgetId, userId, comment }: { 
    widgetId: Id<"widgets">; 
    userId: string; 
    comment: string; 
  }
) {
  await ctx.db.insert("guestbookComments", {
    widgetId,
    userId,
    comment,
    createdAt: Date.now(),
  });
}

export async function deleteComment(
  ctx: MutationCtx,
  { commentId }: { commentId: Id<"guestbookComments"> }
) {
  await ctx.db.delete(commentId);
}

export async function getCommentById(
  ctx: QueryCtx,
  { commentId }: { commentId: Id<"guestbookComments"> }
) {
  return await ctx.db.get(commentId);
}

export async function getCommentRepo(
  ctx: QueryCtx,
  { commentId }: { commentId: Id<"guestbookComments"> }
): Promise<string | null> {
  const comment = await ctx.db.get(commentId);
  if (!comment) {
    return null;
  }

  const widget = await ctx.db.get(comment.widgetId);
  if (!widget) {
    return null;
  }

  const board = await ctx.db.get(widget.boardId);
  if (!board) {
    return null;
  }

  return board.repo;
}

export async function getGuestbookStats(
  ctx: QueryCtx,
  { widgetId }: { widgetId: Id<"widgets"> }
): Promise<{
  totalComments: number;
  uniqueUsers: number;
  recentAvatars: Array<{
    _id: string;
    userId: string;
    username: string;
    avatarUrl: string | null;
  }>;
}> {
  const widget = await ctx.db.get(widgetId);
  if (!widget || widget.widgetType !== "guestbook") {
    return {
      totalComments: 0,
      uniqueUsers: 0,
      recentAvatars: [],
    };
  }

  const allComments = await ctx.db
    .query("guestbookComments")
    .withIndex("by_widget_created", (q) => q.eq("widgetId", widgetId))
    .collect();

  const uniqueUserIds = [...new Set(allComments.map((c) => c.userId))];

  const recentComments = await ctx.db
    .query("guestbookComments")
    .withIndex("by_widget_created", (q) => q.eq("widgetId", widgetId))
    .order("desc")
    .take(3);

  const recentAvatars: Array<{
    _id: string;
    userId: string;
    username: string;
    avatarUrl: string | null;
  }> = await Promise.all(
    recentComments.map(
      async (
        comment,
      ): Promise<{
        _id: string;
        userId: string;
        username: string;
        avatarUrl: string | null;
      }> => {
        const user: any = await ctx.runQuery(api.auth.getUserById, {
          id: comment.userId,
        });

        return {
          _id: comment._id,
          userId: comment.userId,
          username: user?.name || "Anon",
          avatarUrl: (user?.image as string) || null,
        };
      },
    ),
  );

  return {
    totalComments: allComments.length,
    uniqueUsers: uniqueUserIds.length,
    recentAvatars,
  };
}

export async function checkUserCanComment(
  ctx: QueryCtx,
  { userId, widgetId }: { userId: string; widgetId: Id<"widgets"> }
) {
  const comments = await ctx.db
    .query("guestbookComments")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .filter((q) => q.eq(q.field("widgetId"), widgetId))
    .collect();

  return {
    canComment: comments.length < 5,
    commentCount: comments.length,
    canDelete: false,
  };
}