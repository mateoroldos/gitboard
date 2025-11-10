import type { PollData, PollingConfig } from "./types";

export function createPreviewPollData(config: PollingConfig): PollData | null {
  if (!config.options) {
    return null;
  }

  const options = config.options
    .split("\n")
    .map((optionText: string) => optionText.trim())
    .filter((optionText: string) => optionText.length > 0)
    .map((optionText: string, index: number) => ({
      id: `option_${index}`,
      text: optionText,
      votes: 0,
    }));

  if (options.length === 0) {
    return null;
  }

  return {
    question: config.question || "",
    options,
    showPercentages: config.showPercentages || false,
  };
}

export function calculatePercentage(votes: number, totalVotes: number): number {
  return totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
}