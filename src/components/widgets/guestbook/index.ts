import { WidgetDefinition } from "../types";
import { GuestbookWidget } from "./GuestbookWidget";
import { MessageSquare } from "lucide-react";

export const guestbookWidget: WidgetDefinition = {
  id: "guestbook",
  name: "Guestbook",
  description: "Let visitors leave comments and sign your guestbook",
  category: "custom",
  icon: MessageSquare,

  component: GuestbookWidget,

  defaultConfig: {},

  size: {
    default: { width: 320, height: 280 },
    min: { width: 320, height: 360 },
    max: { width: 500, height: 600 },
  },

  renderStyle: "card",
};
