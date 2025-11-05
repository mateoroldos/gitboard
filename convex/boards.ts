import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import * as Boards from "./model/boards";

export const getBoardById = query({
  args: {
    boardId: v.id("boards"),
  },
  handler: async (ctx, { boardId }) => {
    return await Boards.getBoardById(ctx, { boardId });
  },
});

export const getBoardByRepo = query({
  args: {
    repo: v.string(),
  },
  handler: async (ctx, { repo }) => {
    return await Boards.getBoardByRepo(ctx, { repo });
  },
});

export const createBoard = mutation({
  args: {
    name: v.string(),
    repo: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { name, repo, description }) => {
    return await Boards.createBoard(ctx, {
      name,
      repo,
      description,
    });
  },
});
