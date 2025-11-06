import { z } from "zod";
import { GitHubStarsWidget } from "./github-stars/GitHubStarsWidget";
import type { WidgetDefinition, WidgetCategory } from "./types";

const githubStarsConfigSchema = z.object({
  showIcon: z.boolean(),
});

type GitHubStarsConfig = z.infer<typeof githubStarsConfigSchema>;

const githubStarsWidget: WidgetDefinition<GitHubStarsConfig> = {
  id: "github-stars",
  name: "GitHub Stars",
  description: "Display repository star count with customizable appearance",
  category: "github",
  icon: "⭐",

  component: GitHubStarsWidget,
  configSchema: githubStarsConfigSchema,

  defaultConfig: {
    showIcon: true,
  },

  size: {
    default: { width: 280, height: 120 },
    min: { width: 200, height: 80 },
    max: { width: 400, height: 200 },
  },
};

export const widgetRegistry: Record<WidgetCategory, WidgetDefinition[]> = {
  github: [githubStarsWidget],
  analytics: [],
  notes: [],
  links: [],
  custom: [],
};

// Helpers
export function getWidgetById(id: string): WidgetDefinition | undefined {
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
