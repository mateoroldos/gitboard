import { PollRoot } from "./poll-root";
import { PollQuestion } from "./poll-question";
import { PollOptions } from "./poll-options";
import { PollAuthGate } from "./poll-auth-gate";
import { PollVoteButton } from "./poll-vote-button";
import { PollResults } from "./poll-results";
import { PollEmptyState } from "./poll-empty-state";
import { usePoll } from "./poll-context";

function PollContent() {
  const { pollData } = usePoll();

  if (!pollData || !pollData.question || pollData.options.length === 0) {
    return <PollEmptyState />;
  }

  return (
    <div className="space-y-4">
      <PollQuestion />
      <PollOptions />
      <PollAuthGate>
        <PollVoteButton />
      </PollAuthGate>
      <PollResults />
    </div>
  );
}

export function PollingWidget() {
  return (
    <PollRoot>
      <PollContent />
    </PollRoot>
  );
}
