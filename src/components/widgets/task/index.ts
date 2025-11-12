import z from "zod";
import {
  createWidgetSchema,
  stringField,
  textareaField,
  enumField,
  dateField,
} from "../zod-helpers";
import { WidgetDefinition } from "../types";
import { TaskWidget } from "./TaskWidget";
import { TaskPreview } from "./TaskPreview";
import { CheckSquare } from "lucide-react";

const taskConfigSchema = createWidgetSchema({
  title: stringField({
    label: "Task Title",
    placeholder: "Implement user authentication",
    description: "Enter the task title",
  }),
  description: textareaField({
    label: "Description",
    placeholder: "Add OAuth integration with GitHub and Google providers",
    description: "Describe what this task involves",
    rows: 3,
  }),
  status: enumField(["Not Started", "In Progress", "Completed", "Cancelled"], {
    label: "Status",
    description: "Current status of the task",
  }),
  priority: enumField(["High", "Medium", "Low"], {
    label: "Priority",
    description: "Task priority level",
  }),
  targetDate: dateField({
    label: "Target Date",
    placeholder: "Select target completion date",
    description: "When should this task be completed?",
  }),
  githubPR: stringField({
    label: "GitHub PR",
    placeholder: "https://github.com/owner/repo/pull/123",
    description: "Link to related GitHub pull request (optional)",
  }),
});

type TaskConfig = z.infer<typeof taskConfigSchema>;

export const taskWidget: WidgetDefinition<TaskConfig> = {
  id: "task",
  name: "Task",
  description: "Track individual task progress with status and details",
  category: "custom",
  icon: CheckSquare,

  component: TaskWidget,
  previewComponent: TaskPreview,
  configSchema: taskConfigSchema,

  defaultConfig: {
    title: "",
    description: "",
    status: "Not Started",
    priority: "Medium",
    targetDate: "",
    githubPR: "",
  },

  size: {
    default: { width: 300, height: 260 },
    min: { width: 260, height: 220 },
    max: { width: 500, height: 350 },
  },

  renderStyle: "card",
};
