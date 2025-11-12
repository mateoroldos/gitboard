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
import * as Polls from "./model/polls";

export const getPollData = query({
  args: { widgetId: v.id("widgets") },
  handler: async (ctx, { widgetId }) => {
    return await Polls.getPollData(ctx, { widgetId });
  },
});

export const getUserVote = internalQuery({
  args: {
    userId: v.string(),
    widgetId: v.id("widgets"),
  },
  handler: async (ctx, { userId, widgetId }) => {
    return await Polls.getUserVote(ctx, { userId, widgetId });
  },
});

export const recordVote = internalMutation({
  args: {
    widgetId: v.id("widgets"),
    userId: v.string(),
    optionId: v.string(),
  },
  handler: async (ctx, { widgetId, userId, optionId }) => {
    await Polls.recordVote(ctx, { widgetId, userId, optionId });
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
    return await Polls.checkUserVote(ctx, { userId, widgetId });
  },
});

