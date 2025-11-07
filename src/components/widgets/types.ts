import type React from "react";
import type * as z from "zod";

export interface WidgetProps<TConfig = Record<string, any>> {
  config: TConfig;
  instanceId: string;
  repository: string; // owner/name format
  onConfigChange?: (config: TConfig) => void;
  onDelete?: () => void;
  isEditing?: boolean;
}

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

  component: React.ComponentType<WidgetProps<any>>;
  previewComponent?: React.ComponentType<WidgetProps<any>>;

  configSchema: z.ZodObject<z.ZodType>;
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
}

export interface WidgetInstanceData {
  _id: string;
  widgetType: string;
  config: Record<string, any>;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}
