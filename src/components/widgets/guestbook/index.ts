import z from "zod";
import { WidgetDefinition } from "../types";
import { GuestbookWidget } from "./GuestbookWidget";

const guestbookConfigSchema = z.object({});

type GuestbookConfig = z.infer<typeof guestbookConfigSchema>;

export const guestbookWidget: WidgetDefinition<GuestbookConfig> = {
  id: "guestbook",
  name: "Guestbook",
  description: "Let visitors leave comments and sign your guestbook",
  category: "custom",
  icon: "📝",

  component: GuestbookWidget,
  configSchema: guestbookConfigSchema,

  defaultConfig: {},

  size: {
    default: { width: 320, height: 280 },
    min: { width: 280, height: 200 },
    max: { width: 500, height: 400 },
  },

  renderStyle: "card",
};

