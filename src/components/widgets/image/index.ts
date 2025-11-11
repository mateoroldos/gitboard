import z from "zod";
import {
  createWidgetSchema,
  stringField,
  enumField,
  numberField,
} from "../zod-helpers";
import { WidgetDefinition } from "../types";
import { ImageWidget } from "./ImageWidget";
import { ImageEditingOverlay } from "./ImageEditingOverlay";

const imageConfigSchema = createWidgetSchema({
  title: stringField({
    label: "Caption",
    placeholder: "Enter image caption (optional)",
    description: "Optional caption displayed over the image",
  }),
  altText: stringField({
    label: "Alt Text",
    placeholder: "Describe the image for accessibility",
    description: "Alternative text for screen readers and accessibility",
  }),
  fit: enumField(["cover", "contain", "fill"], {
    label: "Image Fit",
    description: "How the image should fit within the widget",
  }),
  borderRadius: numberField({
    label: "Border Radius",
    placeholder: "0",
    description: "Border radius in pixels (0 for square corners)",
  }),
});

type ImageConfig = z.infer<typeof imageConfigSchema>;

export const imageWidget: WidgetDefinition<ImageConfig> = {
  id: "image",
  name: "Image",
  description: "Display images with customizable fit and styling options",
  category: "custom",
  icon: "Image",

  component: ImageWidget,
  customEditingComponent: ImageEditingOverlay,
  configSchema: imageConfigSchema,

  defaultConfig: {
    title: "",
    altText: "",
    fit: "contain",
    borderRadius: 0,
  },

  size: {
    default: { width: 320, height: 240 },
    min: { width: 20, height: 20 },
    max: { width: 600, height: 450 },
  },

  renderStyle: "raw",
};
