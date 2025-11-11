import type React from "react";
import type * as z from "zod";
import { Doc } from "convex/_generated/dataModel";

export type WidgetCategory =
  | "github"
  | "analytics"
  | "notes"
  | "links"
  | "custom";

export interface WidgetDefinition<TConfig = Record<string, any>> {
  id: string;
  name: string;
  description: string;
  category: WidgetCategory;
  icon: string;

  component: React.ComponentType;
  previewComponent?: React.ComponentType;

  configSchema: z.ZodObject<Record<string, z.ZodType>>;
  defaultConfig: TConfig;

  size: {
    default: { width: number; height: number };
    min: { width: number; height: number };
    max?: { width: number; height: number };
    aspectRatio?: number; // Optional fixed aspect ratio
  };

  preview?: {
    thumbnail?: string;
    description?: string;
  };

  renderStyle: "card" | "raw";
}

export interface WidgetInstance<TConfig = Record<string, any>>
  extends Doc<"widgets"> {
  config: TConfig;
}
