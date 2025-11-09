import type { WidgetProps } from "../types";
import { PollingDisplay, type PollData } from "./PollingDisplay";

interface PollingConfig {
  question: string;
  options: string;
  showPercentages: boolean;
}

export function PollingPreview({
  widget,
  onConfigChange,
  onDelete,
}: WidgetProps<PollingConfig>) {
  const pollData: PollData | null = widget.config.options
    ? {
        question: widget.config.question || "",
        options: widget.config.options
          .split("\n")
          .map((optionText: string) => optionText.trim())
          .filter((optionText: string) => optionText.length > 0)
          .map((optionText: string, index: number) => ({
            id: `option_${index}`,
            text: optionText,
            votes: 0, // No votes in preview
          })),
        showPercentages: widget.config.showPercentages || false,
      }
    : null;

  return (
    <PollingDisplay
      widget={widget}
      pollData={pollData}
      onEdit={onConfigChange ? () => onConfigChange(widget.config) : undefined}
      onDelete={onDelete}
      isEditing={true}
    />
  );
}

