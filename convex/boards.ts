import { query, internalMutation, action } from "./_generated/server";
import { v } from "convex/values";
import * as Boards from "./model/boards";
import { requireRepoAccess } from "./model/auth";
import { internal } from "./_generated/api";

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

const createBoardArgs = {
  name: v.string(),
  repo: v.string(),
  description: v.optional(v.string()),
};

export const createBoard = internalMutation({
  args: createBoardArgs,
  handler: async (ctx, { name, repo, description }) => {
    return await Boards.createBoard(ctx, {
      name,
      repo,
      description,
    });
  },
});

export const createBoardAction = action({
  args: createBoardArgs,
  handler: async (ctx, args) => {
    await requireRepoAccess(ctx, args.repo);

    await ctx.runMutation(internal.boards.createBoard, {
      ...args,
    });
  },
});
