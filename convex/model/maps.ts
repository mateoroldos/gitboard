import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export async function getMapData(
  ctx: QueryCtx,
  { widgetId }: { widgetId: Id<"widgets"> },
) {
  const widget = await ctx.db.get(widgetId);
  if (!widget || widget.widgetType !== "map") {
    return null;
  }

  const pins = await ctx.db
    .query("mapPins")
    .withIndex("by_widget", (q) => q.eq("widgetId", widgetId))
    .collect();

  return {
    title: widget.config.title || "",
    pins: pins.map((pin) => ({
      id: pin._id,
      userId: pin.userId,
      latitude: pin.latitude,
      longitude: pin.longitude,
      createdAt: pin.createdAt,
    })),
    showStats: widget.config.showStats || true,
  };
}

export async function getUserPin(
  ctx: QueryCtx,
  { userId, widgetId }: { userId: string; widgetId: Id<"widgets"> },
) {
  return await ctx.db
    .query("mapPins")
    .withIndex("by_user_widget", (q) =>
      q.eq("userId", userId).eq("widgetId", widgetId),
    )
    .first();
}

export async function addPin(
  ctx: MutationCtx,
  {
    widgetId,
    userId,
    latitude,
    longitude,
  }: {
    widgetId: Id<"widgets">;
    userId: string;
    latitude: number;
    longitude: number;
  },
) {
  // Remove existing pin if it exists (one pin per user)
  const existingPin = await ctx.db
    .query("mapPins")
    .withIndex("by_user_widget", (q) =>
      q.eq("userId", userId).eq("widgetId", widgetId),
    )
    .first();

  if (existingPin) {
    await ctx.db.delete(existingPin._id);
  }

  // Add new pin
  await ctx.db.insert("mapPins", {
    widgetId,
    userId,
    latitude,
    longitude,
    createdAt: Date.now(),
  });
}

export async function removePin(
  ctx: MutationCtx,
  {
    widgetId,
    userId,
  }: {
    widgetId: Id<"widgets">;
    userId: string;
  },
) {
  const existingPin = await ctx.db
    .query("mapPins")
    .withIndex("by_user_widget", (q) =>
      q.eq("userId", userId).eq("widgetId", widgetId),
    )
    .first();

  if (existingPin) {
    await ctx.db.delete(existingPin._id);
  }
}

