import {
  query,
  action,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { v } from "convex/values";
import { requireSession } from "./model/auth";
import { internal } from "./_generated/api";
import * as Maps from "./model/maps";

export const getMapData = query({
  args: { widgetId: v.id("widgets") },
  handler: async (ctx, { widgetId }) => {
    return await Maps.getMapData(ctx, { widgetId });
  },
});

export const getUserPin = internalQuery({
  args: {
    userId: v.string(),
    widgetId: v.id("widgets"),
  },
  handler: async (ctx, { userId, widgetId }) => {
    return await Maps.getUserPin(ctx, { userId, widgetId });
  },
});

export const addPin = internalMutation({
  args: {
    widgetId: v.id("widgets"),
    userId: v.string(),
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, { widgetId, userId, latitude, longitude }) => {
    await Maps.addPin(ctx, { widgetId, userId, latitude, longitude });
  },
});

export const removePin = internalMutation({
  args: {
    widgetId: v.id("widgets"),
    userId: v.string(),
  },
  handler: async (ctx, { widgetId, userId }) => {
    await Maps.removePin(ctx, { widgetId, userId });
  },
});

export const placePin = action({
  args: {
    widgetId: v.id("widgets"),
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, { widgetId, latitude, longitude }) => {
    await requireSession(ctx);
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity!.subject;

    await ctx.runMutation(internal.maps.addPin, {
      widgetId,
      userId,
      latitude,
      longitude,
    });
  },
});

export const deletePinAction = action({
  args: {
    widgetId: v.id("widgets"),
  },
  handler: async (ctx, { widgetId }) => {
    await requireSession(ctx);
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity!.subject;

    await ctx.runMutation(internal.maps.removePin, {
      widgetId,
      userId,
    });
  },
});

export const checkUserPin = query({
  args: {
    widgetId: v.id("widgets"),
  },
  handler: async (ctx, { widgetId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const userId = identity.subject;
    return await Maps.getUserPin(ctx, { userId, widgetId });
  },
});

