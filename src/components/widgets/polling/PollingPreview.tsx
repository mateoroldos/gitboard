import type { WidgetProps } from "../types";
import { PollingDisplay, type PollData } from "./PollingDisplay";

interface PollingConfig {
  question: string;
  options: string;
  showPercentages: boolean;
}

export function PollingPreview({
  config,
  onConfigChange,
  onDelete,
}: WidgetProps<PollingConfig>) {
  const pollData: PollData | null = config.options ? {
    question: config.question || "",
    options: config.options
      .split('\n')
      .map((optionText: string) => optionText.trim())
      .filter((optionText: string) => optionText.length > 0)
      .map((optionText: string, index: number) => ({
        id: `option_${index}`,
        text: optionText,
        votes: 0, // No votes in preview
      })),
    showPercentages: config.showPercentages || false,
  } : null;

  return (
    <PollingDisplay
      pollData={pollData}
      onEdit={onConfigChange ? () => onConfigChange(config) : undefined}
      onDelete={onDelete}
      isEditing={true}
    />
  );
}