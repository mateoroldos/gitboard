import { z } from "zod";
import { GitHubStarsWidget } from "./github-stars/GitHubStarsWidget";
import { PollingWidget } from "./polling/PollingWidget";
import { PollingPreview } from "./polling/PollingPreview";
import type { WidgetDefinition, WidgetCategory } from "./types";
import {
  booleanField,
  createWidgetSchema,
  stringField,
  textareaField,
} from "./zod-helpers";

const githubStarsConfigSchema = createWidgetSchema({
  showIcon: booleanField({
    label: "Show Icon",
  }),
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

const pollingConfigSchema = createWidgetSchema({
  question: stringField({
    label: "Poll Question",
    placeholder: "What's your favorite programming language?",
    description: "Enter your poll question",
  }),
  options: textareaField({
    label: "Poll Options",
    placeholder: "Option 1\nOption 2\nOption 3",
    description: "Enter each option on a new line (minimum 2 options required)",
    rows: 4,
  }),
  showPercentages: booleanField({
    label: "Show Percentages",
    description: "Display vote percentages in results",
  }),
});

type PollingConfig = z.infer<typeof pollingConfigSchema>;

const pollingWidget: WidgetDefinition<PollingConfig> = {
  id: "polling",
  name: "Poll",
  description: "Create interactive polls for community engagement",
  category: "custom",
  icon: "📊",

  component: PollingWidget,
  previewComponent: PollingPreview,
  configSchema: pollingConfigSchema,

  defaultConfig: {
    question: "",
    options: "",
    showPercentages: true,
  },

  size: {
    default: { width: 320, height: 280 },
    min: { width: 280, height: 200 },
    max: { width: 500, height: 400 },
  },
};

export const widgetRegistry: Record<WidgetCategory, WidgetDefinition[]> = {
  github: [githubStarsWidget],
  analytics: [],
  notes: [],
  links: [],
  custom: [pollingWidget],
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
