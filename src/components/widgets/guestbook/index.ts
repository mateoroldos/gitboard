import { WidgetDefinition } from "../types";
import { GuestbookWidget } from "./GuestbookWidget";

export const guestbookWidget: WidgetDefinition = {
  id: "guestbook",
  name: "Guestbook",
  description: "Let visitors leave comments and sign your guestbook",
  category: "custom",
  icon: "📝",

  component: GuestbookWidget,

  defaultConfig: {},

  size: {
    default: { width: 320, height: 280 },
    min: { width: 280, height: 200 },
    max: { width: 500, height: 400 },
  },

  renderStyle: "card",
};

