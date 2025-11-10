import { PollContext } from "./poll-context";
import { PollQuestion } from "./poll-question";
import { PollOptions } from "./poll-options";
import { PollResults } from "./poll-results";
import { PollEmptyState } from "./poll-empty-state";
import type { PollingConfig } from "./types";
import { createPreviewPollData } from "./utils";
import { useWidget } from "../WidgetProvider";

export function PollingPreview() {
  const { widget } = useWidget();
  const config = widget.config as PollingConfig;
  const pollData = createPreviewPollData(config);

  const contextValue = {
    pollData,
    userVote: null,
    selectedOption: null,
    isVoting: false,
    hasVoted: false,
    totalVotes: 0,
    isEditing: true,
    actions: {
      selectOption: () => {},
      vote: () => {},
      clearSelection: () => {},
    },
  };

  return (
    <>
      {!pollData || !pollData.question || pollData.options.length === 0 ? (
        <PollEmptyState />
      ) : (
        <PollContext.Provider value={contextValue}>
          <div className="space-y-4">
            <PollQuestion />
            <PollOptions />
            <PollResults showVotedMessage={false} />
          </div>
        </PollContext.Provider>
      )}
    </>
  );
}
