import { TextRoot } from "./text-root";
import { TextDisplay } from "./text-display";
import { TextEmptyState } from "./text-empty-state";
import { useWidget } from "../WidgetProvider";
import { createTextDataFromConfig } from "./utils";
import type { TextConfig } from "./types";

function TextContent() {
  const { widget } = useWidget<TextConfig>();
  const textData = createTextDataFromConfig(widget.config);

  if (!textData || !textData.content) {
    return <TextEmptyState />;
  }

  return <TextDisplay />;
}

export function TextWidget() {
  return (
    <TextRoot>
      <TextContent />
    </TextRoot>
  );
}