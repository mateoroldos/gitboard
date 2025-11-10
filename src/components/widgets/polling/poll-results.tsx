import { usePoll } from "./poll-context";
import { cn } from "@/lib/utils";

interface PollResultsProps {
  showTotal?: boolean;
  showVotedMessage?: boolean;
  className?: string;
}

export function PollResults({ 
  showTotal = true, 
  showVotedMessage = true,
  className 
}: PollResultsProps) {
  const { totalVotes, hasVoted } = usePoll();

  return (
    <div className={cn("text-sm text-muted-foreground text-center space-y-1", className)}>
      {showTotal && (
        <div>Total votes: {totalVotes}</div>
      )}
      {hasVoted && showVotedMessage && (
        <div className="text-primary">You have voted in this poll</div>
      )}
    </div>
  );
}