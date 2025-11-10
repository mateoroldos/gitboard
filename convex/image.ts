import { query } from "./_generated/server";
import { v } from "convex/values";
import { R2 } from "@convex-dev/r2";
import { components } from "./_generated/api";

export const r2 = new R2(components.r2);

export const { generateUploadUrl, syncMetadata } = r2.clientApi({
  checkUpload: async (ctx, bucket) => {
    // TODO: Add user authentication check here
    // const user = await userFromAuth(ctx);
    // if (!user) throw new Error("Unauthorized");
  },
  onUpload: async (ctx, bucket, key) => {
    // Optional: Log upload or perform additional actions
    console.log(`Image uploaded with key: ${key}`);
  },
});

export const getImageData = query({
  args: { widgetId: v.id("widgets") },
  handler: async (ctx, { widgetId }) => {
    const widget = await ctx.db.get(widgetId);
    if (!widget || widget.widgetType !== "image") {
      return null;
    }

    const config = widget.config;

    // If no image key, return empty state
    if (!config.imageKey) {
      return {
        imageKey: "",
        imageUrl: null,
        title: config.title || "",
        altText: config.altText || "",
        fit: config.fit || "cover",
        borderRadius: config.borderRadius || 0,
      };
    }

    // Generate signed URL for the image
    const imageUrl = await r2.getUrl(config.imageKey, {
      expiresIn: 60 * 60 * 24, // 24 hours
    });

    return {
      imageKey: config.imageKey,
      imageUrl,
      title: config.title || "",
      altText: config.altText || "",
      fit: isValidFit(config.fit) ? config.fit : "cover",
      borderRadius:
        typeof config.borderRadius === "number" ? config.borderRadius : 0,
    };
  },
});

function isValidFit(fit: string): boolean {
  return ["cover", "contain", "fill"].includes(fit);
}

