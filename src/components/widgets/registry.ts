import { GitHubStarsWidget } from "./GitHubStarsWidget";
import { WidgetDefinition } from "./widget-config";

export const widgets: WidgetDefinition[] = [
  {
    id: "github-stars",
    name: "GitHub Stars",
    description: "Display repository star count",
    component: GitHubStarsWidget,
    defaultConfig: {
      showIcon: true,
    },
  },
];
