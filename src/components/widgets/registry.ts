import { GitHubStarsWidget } from "./github-stars/GitHubStarsWidget";
import { WidgetDefinition } from "./types";

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
