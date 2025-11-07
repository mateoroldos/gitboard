import { Id } from "convex/_generated/dataModel";
import { MutationCtx } from "convex/_generated/server";

export interface WidgetLifecycleHooks {
  onCreate?: (
    ctx: MutationCtx,
    widgetId: Id<"widgets">,
    config: any,
  ) => Promise<void>;
  onUpdate?: (
    ctx: MutationCtx,
    widgetId: Id<"widgets">,
    config: any,
  ) => Promise<void>;
  onDelete?: (ctx: MutationCtx, widgetId: Id<"widgets">) => Promise<void>;
}

const widgetHooks: Record<string, WidgetLifecycleHooks> = {
  polling: {
    onDelete: async (ctx, widgetId) => {
      // Delete all votes for this widget when widget is deleted
      const votes = await ctx.db
        .query("pollVotes")
        .withIndex("by_widget", (q) => q.eq("widgetId", widgetId))
        .collect();

      for (const vote of votes) {
        await ctx.db.delete(vote._id);
      }
    },
  },
};

export async function executeWidgetLifecycleHook(
  ctx: MutationCtx,
  widgetType: string,
  hook: keyof WidgetLifecycleHooks,
  widgetId: Id<"widgets">,
  config?: any,
) {
  const hooks = widgetHooks[widgetType];
  if (!hooks || !hooks[hook]) {
    return; // No hooks defined for this widget type
  }

  try {
    if (hook === "onCreate" && hooks.onCreate) {
      await hooks.onCreate(ctx, widgetId, config);
    } else if (hook === "onUpdate" && hooks.onUpdate) {
      await hooks.onUpdate(ctx, widgetId, config);
    } else if (hook === "onDelete" && hooks.onDelete) {
      await hooks.onDelete(ctx, widgetId);
    }
  } catch (error) {
    console.error(
      `Error executing ${hook} hook for widget type ${widgetType}:`,
      error,
    );
    // Don't throw - we don't want widget lifecycle hooks to break core widget operations
  }
}
