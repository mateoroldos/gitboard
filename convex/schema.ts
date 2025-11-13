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
    widgetType: v.string(),
    config: v.any(),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    size: v.object({
      width: v.number(),
      height: v.number(),
    }),
    rotation: v.optional(v.number()),
    title: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_board", ["boardId"]),

  pollVotes: defineTable({
    widgetId: v.id("widgets"),
    userId: v.string(),
    optionId: v.string(),
    createdAt: v.number(),
  })
    .index("by_widget", ["widgetId"])
    .index("by_user_widget", ["userId", "widgetId"]),

  guestbookComments: defineTable({
    widgetId: v.id("widgets"),
    userId: v.string(),
    comment: v.string(),
    createdAt: v.number(),
  })
    .index("by_widget", ["widgetId"])
    .index("by_user", ["userId"])
    .index("by_widget_created", ["widgetId", "createdAt"]),

  mapPins: defineTable({
    widgetId: v.id("widgets"),
    userId: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    createdAt: v.number(),
  })
    .index("by_widget", ["widgetId"])
    .index("by_user_widget", ["userId", "widgetId"]),
});
