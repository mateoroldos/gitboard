import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export async function getPollData(
  ctx: QueryCtx,
  { widgetId }: { widgetId: Id<"widgets"> },
) {
  const widget = await ctx.db.get(widgetId);
  if (!widget || widget.widgetType !== "polling") {
    return null;
  }

  const votes = await ctx.db
    .query("pollVotes")
    .withIndex("by_widget", (q) => q.eq("widgetId", widgetId))
    .collect();

  const voteCounts: Record<string, number> = {};
  for (const vote of votes) {
    voteCounts[vote.optionId] = (voteCounts[vote.optionId] || 0) + 1;
  }

  const options = widget.config.options
    ? widget.config.options
        .split("\n")
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
}

export async function getUserVote(
  ctx: QueryCtx,
  { userId, widgetId }: { userId: string; widgetId: Id<"widgets"> },
) {
  return await ctx.db
    .query("pollVotes")
    .withIndex("by_user_widget", (q) =>
      q.eq("userId", userId).eq("widgetId", widgetId),
    )
    .first();
}

export async function recordVote(
  ctx: MutationCtx,
  {
    widgetId,
    userId,
    optionId,
  }: {
    widgetId: Id<"widgets">;
    userId: string;
    optionId: string;
  },
) {
  await ctx.db.insert("pollVotes", {
    widgetId,
    userId,
    optionId,
    createdAt: Date.now(),
  });
}

