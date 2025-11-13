import { PollQuestion } from "./poll-question";
import { PollOptions } from "./poll-options";
import { PollResults } from "./poll-results";
import { PollEmptyState } from "./poll-empty-state";
import { PollStateProvider } from "./poll-state-context";
import type { PollingConfig, PollData } from "./types";
import { createPreviewPollData } from "./utils";
import { useWidget } from "../widget/WidgetProvider";

export function PollingPreview() {
  const { widget } = useWidget();
  const config = widget.config as PollingConfig;
  const pollData = createPreviewPollData(config);

  const mockPollData: PollData = pollData || {
    question: "What's the best programming language? 🤔",
    options: [
      { id: "1", text: "JavaScript", votes: 42 },
      { id: "2", text: "TypeScript", votes: 38 },
      { id: "3", text: "Python", votes: 25 },
      { id: "4", text: "Rust", votes: 15 },
      { id: "5", text: "Go", votes: 12 },
    ],
    showPercentages: true,
  };

  if (
    !mockPollData ||
    !mockPollData.question ||
    mockPollData.options.length === 0
  ) {
    return <PollEmptyState />;
  }

  return (
    <PollStateProvider
      pollData={mockPollData}
      userVote={null}
      isEditing={true}
      isVoting={false}
      onVote={async () => {
        // Preview mode - no actual voting
        console.log("Preview mode: voting disabled");
      }}
    >
      <div className="space-y-4 w-full overflow-hidden h-[350px] flex flex-col">
        <PollQuestion />
        <PollOptions />
        <PollResults />
      </div>
    </PollStateProvider>
  );
}
