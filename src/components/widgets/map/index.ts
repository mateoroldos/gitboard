import z from "zod";
import { booleanField, createWidgetSchema, stringField } from "../zod-helpers";
import { WidgetDefinition } from "../types";
import { MapWidget } from "./MapWidget";
import { MapPreview } from "./MapPreview";
import { MapPin } from "lucide-react";

const mapConfigSchema = createWidgetSchema({
  title: stringField({
    label: "Map Title",
    placeholder: "Where are you visiting?",
    description: "Enter a title for your visitor map",
  }),
  showStats: booleanField({
    label: "Show Statistics",
    description: "Display total visitor count and pin statistics",
  }),
});

type MapConfig = z.infer<typeof mapConfigSchema>;

export const mapWidget: WidgetDefinition<MapConfig> = {
  id: "map",
  name: "Visitor Map",
  description: "Interactive world map where visitors can pin their locations",
  category: "custom",
  icon: MapPin,

  component: MapWidget,
  previewComponent: MapPreview,
  configSchema: mapConfigSchema,

  defaultConfig: {
    title: "Where are you visiting?",
    showStats: true,
  },

  size: {
    default: { width: 400, height: 450 },
    min: { width: 350, height: 400 },
    max: { width: 600, height: 700 },
  },

  renderStyle: "card",
};

