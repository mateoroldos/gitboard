import * as z from "zod";
import { booleanField, createWidgetSchema } from "../zod-helpers";
import { WidgetDefinition } from "../types";
import { GitHubStarsWidget } from "./GitHubStarsWidget";

const githubStarsConfigSchema = createWidgetSchema({
  showIcon: booleanField({
    label: "Show Icon",
  }),
});

type GitHubStarsConfig = z.infer<typeof githubStarsConfigSchema>;

export const githubStarsWidget: WidgetDefinition<GitHubStarsConfig> = {
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
