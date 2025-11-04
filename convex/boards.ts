import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getBoards = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("boards").order("desc").collect();
  },
});

export const getBoardByRepo = query({
  args: {
    repo: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("boards")
      .withIndex("by_repo", (q) => q.eq("repo", args.repo))
      .first();
  },
});

export const createBoard = mutation({
  args: {
    name: v.string(),
    repo: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if board already exists for this repo
    const existing = await ctx.db
      .query("boards")
      .withIndex("by_repo", (q) => q.eq("repo", args.repo))
      .first();
    
    if (existing) {
      return existing._id;
    }

    const now = Date.now();
    return await ctx.db.insert("boards", {
      name: args.name,
      repo: args.repo,
      description: args.description,
      createdAt: now,
      updatedAt: now,
    });
  },
});

