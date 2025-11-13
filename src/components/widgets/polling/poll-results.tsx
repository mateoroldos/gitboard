import { cn } from "@/lib/utils";
import { usePoll } from "./poll-state-context";

interface PollResultsProps {
  showTotal?: boolean;
  showVotedMessage?: boolean;
  className?: string;
}

export function PollResults({
  showTotal = true,
  showVotedMessage = true,
  className,
}: PollResultsProps) {
  const { totalVotes, hasVoted } = usePoll();

  return (
    <div
      className={cn(
        "text-xs pr-4 text-muted-foreground text-center space-y-1",
        className,
      )}
    >
      {showTotal && <div>Total votes: {totalVotes}</div>}
      {hasVoted && showVotedMessage && (
        <div className="text-primary">You have voted in this poll</div>
      )}
    </div>
  );
}
