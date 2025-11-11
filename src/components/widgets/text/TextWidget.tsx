import { TextRoot } from "./text-root";
import { TextDisplay } from "./text-display";
import { TextEmptyState } from "./text-empty-state";
import { useText } from "./text-context";

function TextContent() {
  const { textData } = useText();

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