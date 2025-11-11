import z from "zod";
import {
  booleanField,
  createWidgetSchema,
  stringField,
  textareaField,
} from "../zod-helpers";
import { WidgetDefinition } from "../types";
import { PollingWidget } from "./PollingWidget";
import { PollingPreview } from "./PollingPreview";

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

export const pollingWidget: WidgetDefinition<PollingConfig> = {
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

  renderStyle: "card",
};
