import { PollQuestion } from "./poll-question";
import { PollOptions } from "./poll-options";
import { PollAuthGate } from "./poll-auth-gate";
import { PollVoteButton } from "./poll-vote-button";
import { PollResults } from "./poll-results";
import { PollEmptyState } from "./poll-empty-state";
import { PollStateProvider } from "./poll-state-context";
import { usePollData } from "./hooks/usePollData";
import { useWidget } from "../widget/WidgetProvider";
import type { PollingConfig } from "./types";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { useAction } from "convex/react";

export function PollingWidget() {
  const { widget, state } = useWidget<PollingConfig>();
  const { pollData, userVote } = usePollData(widget._id);

  const voteMutation = useMutation({
    mutationFn: useAction(api.polls.vote),
  });

  const handleVote = async (optionId: string) => {
    await voteMutation.mutateAsync({
      widgetId: widget._id,
      optionId,
    });
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
