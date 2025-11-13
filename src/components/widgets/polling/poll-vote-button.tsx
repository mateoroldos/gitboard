import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePoll } from "./poll-state-context";

interface PollVoteButtonProps {
  className?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

export function PollVoteButton({
  className,
  variant = "default",
  size = "default",
}: PollVoteButtonProps) {
  const { actions, selectedOption, isVoting, hasVoted } = usePoll();

  if (hasVoted) {
    return null;
  }

  return (
    <div className="pr-4">
      <Button
        onClick={actions.vote}
        disabled={!selectedOption || isVoting}
        className={cn("w-full", className)}
        variant={variant}
        size={size}
      >
        {isVoting && <Loader className="animate-spin mr-2 h-4 w-4" />}
        {isVoting ? "Voting..." : "Vote"}
      </Button>
    </div>
  );
}
