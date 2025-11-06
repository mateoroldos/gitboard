import type React from "react";

export type ConfigFieldType = "string" | "number" | "boolean" | "select" | "color" | "repository";

export interface ConfigField {
  type: ConfigFieldType;
  label: string;
  description?: string;
  required?: boolean;
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>; // For select fields
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export type ConfigSchema = Record<string, ConfigField>;

export interface WidgetProps<TConfig = Record<string, any>> {
  config: TConfig;
  instanceId: string;
  repository: string;
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
  emoji: string;

  component: React.ComponentType<WidgetProps<any>>;

  configSchema: ConfigSchema;
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
