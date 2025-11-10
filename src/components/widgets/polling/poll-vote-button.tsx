import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { usePoll, usePollActions } from "./poll-context";
import { cn } from "@/lib/utils";

interface PollVoteButtonProps {
  className?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

export function PollVoteButton({ 
  className, 
  variant = "default", 
  size = "default" 
}: PollVoteButtonProps) {
  const { selectedOption, isVoting, hasVoted } = usePoll();
  const { vote } = usePollActions();

  if (hasVoted) {
    return null;
  }

  return (
    <Button
      onClick={vote}
      disabled={!selectedOption || isVoting}
      className={cn("w-full", className)}
      variant={variant}
      size={size}
    >
      {isVoting && <Loader className="animate-spin mr-2 h-4 w-4" />}
      {isVoting ? "Voting..." : "Vote"}
    </Button>
  );
}