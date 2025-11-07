import {
  query,
  action,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { v } from "convex/values";
import { requireSession } from "./model/auth";
import { ConvexError } from "convex/values";
import { internal } from "./_generated/api";

export const getPollData = query({
  args: { widgetId: v.id("widgets") },
  handler: async (ctx, { widgetId }) => {
    // Get widget config
    const widget = await ctx.db.get(widgetId);
    if (!widget || widget.widgetType !== "polling") {
      return null;
    }

    // Get all votes for this widget
    const votes = await ctx.db
      .query("pollVotes")
      .withIndex("by_widget", (q) => q.eq("widgetId", widgetId))
      .collect();

    // Calculate vote counts per option
    const voteCounts: Record<string, number> = {};
    for (const vote of votes) {
      voteCounts[vote.optionId] = (voteCounts[vote.optionId] || 0) + 1;
    }

    const options = widget.config.options
      ? widget.config.options
          .split('\n')
          .map((optionText: string) => optionText.trim())
          .filter((optionText: string) => optionText.length > 0)
          .map((optionText: string, index: number) => ({
            id: `option_${index}`,
            text: optionText,
            votes: voteCounts[`option_${index}`] || 0,
          }))
      : [];

    return {
      question: widget.config.question || "",
      options,
      showPercentages: widget.config.showPercentages || false,
    };
  },
});

export const getUserVote = internalQuery({
  args: {
    userId: v.string(),
    widgetId: v.id("widgets"),
  },
  handler: async (ctx, { userId, widgetId }) => {
    return await ctx.db
      .query("pollVotes")
      .withIndex("by_user_widget", (q) =>
        q.eq("userId", userId).eq("widgetId", widgetId),
      )
      .first();
  },
});

export const recordVote = internalMutation({
  args: {
    widgetId: v.id("widgets"),
    userId: v.string(),
    optionId: v.string(),
  },
  handler: async (ctx, { widgetId, userId, optionId }) => {
    // Record the vote
    await ctx.db.insert("pollVotes", {
      widgetId,
      userId,
      optionId,
      createdAt: Date.now(),
    });
  },
});

export const vote = action({
  args: {
    widgetId: v.id("widgets"),
    optionId: v.string(),
  },
  handler: async (ctx, { widgetId, optionId }) => {
    await requireSession(ctx);
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity!.subject;

    // Check if user already voted
    const existingVote = await ctx.runQuery(internal.polls.getUserVote, {
      userId,
      widgetId,
    });

    if (existingVote) {
      throw new ConvexError({
        message: "You have already voted in this poll",
        code: 400,
      });
    }

    // Record the vote
    await ctx.runMutation(internal.polls.recordVote, {
      widgetId,
      userId,
      optionId,
    });
  },
});

export const checkUserVote = query({
  args: {
    widgetId: v.id("widgets"),
  },
  handler: async (ctx, { widgetId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const userId = identity.subject;
    return await ctx.db
      .query("pollVotes")
      .withIndex("by_user_widget", (q) =>
        q.eq("userId", userId).eq("widgetId", widgetId),
      )
      .first();
  },
});

