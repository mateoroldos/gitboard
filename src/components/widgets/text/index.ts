import z from "zod";
import {
  createWidgetSchema,
  stringField,
  enumField,
  numberField,
} from "../zod-helpers";
import { WidgetDefinition } from "../types";
import { TextWidget } from "./TextWidget";
import { TextEditingOverlay } from "./TextEditingOverlay";
import { Type } from "lucide-react";

const textConfigSchema = createWidgetSchema({
  content: stringField({
    label: "Text Content",
    placeholder: "Enter your text here...",
    description: "The text content to display",
  }),
  fontScale: numberField({
    label: "Font Scale",
    placeholder: "1.0",
    description: "Scale factor for font size (0.5 = smaller, 2.0 = larger)",
  }),
  fontFamily: enumField(["sans", "serif", "mono"], {
    label: "Font Family",
    description: "Font family for the text",
  }),
  textAlign: enumField(["left", "center", "right", "justify"], {
    label: "Text Alignment",
    description: "How the text should be aligned",
  }),
  fontWeight: enumField(["normal", "medium", "semibold", "bold"], {
    label: "Font Weight",
    description: "Weight/thickness of the text",
  }),
  backgroundColor: stringField({
    label: "Background Color",
    placeholder: "transparent",
    description: "Background color (hex format or 'transparent')",
  }),
});

type TextConfig = z.infer<typeof textConfigSchema>;

export const textWidget: WidgetDefinition<TextConfig> = {
  id: "text",
  name: "Text",
  description: "Display customizable text with font options and styling",
  category: "custom",
  icon: Type,

  component: TextWidget,
  customEditingComponent: TextEditingOverlay,
  configSchema: textConfigSchema,

  defaultConfig: {
    content: "",
    fontScale: 1.0,
    fontFamily: "mono",
    textAlign: "left",
    fontWeight: "normal",
    backgroundColor: "transparent",
  },

  size: {
    default: { width: 300, height: 200 },
    min: { width: 150, height: 100 },
    max: { width: 600, height: 400 },
  },

  renderStyle: "raw",
};
