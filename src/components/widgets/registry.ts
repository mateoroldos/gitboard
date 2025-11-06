import { GitHubStarsWidget } from "./github-stars/GitHubStarsWidget";
import type { WidgetDefinition, WidgetCategory } from "./types";

const githubStarsWidget: WidgetDefinition<{
  repository: string;
  showIcon: boolean;
  theme: "light" | "dark";
}> = {
  id: "github-stars",
  name: "GitHub Stars",
  description: "Display repository star count with customizable appearance",
  category: "github",
  emoji: "⭐",

  component: GitHubStarsWidget,

  configSchema: {
    showIcon: {
      type: "boolean",
      label: "Show Star Icon",
      description: "Display star icon next to count",
      defaultValue: true,
    },
    theme: {
      type: "select",
      label: "Theme",
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
      ],
      defaultValue: "light",
    },
  },

  defaultConfig: {
    repository: "",
    showIcon: true,
    theme: "light",
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
