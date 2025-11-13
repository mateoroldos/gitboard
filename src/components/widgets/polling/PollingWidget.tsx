import { PollQuestion } from "./poll-question";
import { PollOptions } from "./poll-options";
import { PollAuthGate } from "./poll-auth-gate";
import { PollVoteButton } from "./poll-vote-button";
import { PollResults } from "./poll-results";
import { PollEmptyState } from "./poll-empty-state";
import { PollStateProvider } from "./poll-state-context";
import { usePollData } from "./hooks/usePollData";
import { usePollVoteMutation } from "./hooks/usePollMutations";
import { useWidget } from "../widget/WidgetProvider";
import type { PollingConfig } from "./types";

export function PollingWidget() {
  const { widget, state } = useWidget<PollingConfig>();
  const { pollData, userVote } = usePollData(widget._id);

  const voteMutation = usePollVoteMutation();

  const handleVote = async (optionId: string) => {
    try {
      await voteMutation.mutateAsync({
        widgetId: widget._id,
        optionId,
      });
    } catch (error) {
      // Error is handled by the mutation's onError callback
    }
  };

  if (!pollData || !pollData.question || pollData.options.length === 0) {
    return <PollEmptyState />;
  }

  return (
    <PollStateProvider
      pollData={pollData}
      userVote={userVote}
      isEditing={state.isEditing}
      isVoting={voteMutation.isPending}
      onVote={handleVote}
    >
      <div className="space-y-4 w-full overflow-hidden flex flex-col">
        <PollQuestion />
        <PollOptions />
        <PollAuthGate>
          <PollVoteButton />
        </PollAuthGate>
        <PollResults />
      </div>
    </PollStateProvider>
  );
}
