import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  boards: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    repo: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_repo", ["repo"]),

  widgets: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_board", ["boardId"]),
});
