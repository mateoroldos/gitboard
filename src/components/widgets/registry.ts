import type { WidgetDefinition, WidgetCategory } from "./types";
import { githubStarsWidget } from "./github-stars";
import { pollingWidget } from "./polling";
import { taskWidget } from "./task";
import { imageWidget } from "./image";

export const widgetRegistry: Record<WidgetCategory, WidgetDefinition[]> = {
  github: [githubStarsWidget],
  analytics: [],
  notes: [],
  links: [],
  custom: [pollingWidget, taskWidget, imageWidget],
};

// Helpers
export function getWidgetDefinitionByType(
  id: string,
): WidgetDefinition | undefined {
  return getAllWidgets().find((widget) => widget.id === id);
}

export function getWidgetsByCategory(
  category: WidgetCategory,
): WidgetDefinition[] {
  return widgetRegistry[category] || [];
}

export function getAllWidgets(): WidgetDefinition[] {
  return Object.values(widgetRegistry).flat();
}

export function getWidgetCategories(): WidgetCategory[] {
  return Object.keys(widgetRegistry) as WidgetCategory[];
}
