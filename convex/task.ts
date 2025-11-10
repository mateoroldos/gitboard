import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTaskData = query({
  args: { widgetId: v.id("widgets") },
  handler: async (ctx, { widgetId }) => {
    // Get widget config
    const widget = await ctx.db.get(widgetId);
    if (!widget || widget.widgetType !== "task") {
      return null;
    }

    return {
      title: widget.config.title || "",
      description: widget.config.description || "",
      status: isValidStatus(widget.config.status) ? widget.config.status : "Not Started",
      priority: isValidPriority(widget.config.priority) ? widget.config.priority : "Medium",
      targetDate: widget.config.targetDate || "",
      githubPR: widget.config.githubPR || "",
    };
  },
});

function isValidStatus(status: string): boolean {
  return ["Not Started", "In Progress", "Completed", "Cancelled"].includes(status);
}

function isValidPriority(priority: string): boolean {
  return ["High", "Medium", "Low"].includes(priority);
}