import React from "react";

export interface WidgetDefinition {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  defaultConfig: Record<string, any>;
}

export interface WidgetInstanceData {
  instanceId: string;
  widgetId: string;
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
