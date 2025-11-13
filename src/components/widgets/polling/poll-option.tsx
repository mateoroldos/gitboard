import { usePollOption } from "./hooks/usePollComputed";
import { usePoll } from "./poll-state-context";
import { PollProgressBar } from "./poll-progress-bar";
import { cn } from "@/lib/utils";
import type { PollOption } from "./types";
import { CheckSquare } from "lucide-react";

interface PollOptionProps {
  option: PollOption;
  showPercentages?: boolean;
  className?: string;
}

export function PollOptionComponent({
  option,
  showPercentages = true,
  className,
}: PollOptionProps) {
  const { actions, pollData, userVote, selectedOption, hasVoted } = usePoll();
  const { percentage, isUserVote } = usePollOption(
    option.id,
    pollData,
    userVote,
  );

  const isSelected = selectedOption === option.id;

  const handleClick = () => {
    if (!hasVoted) {
      actions.selectOption(option.id);
    }
  };

  return (
    <button
      type="button"
      className={cn(
        "w-full p-3 border rounded transition-colors text-left",
        hasVoted
          ? isUserVote
            ? "border-primary bg-primary/10"
            : "border-muted bg-muted/50"
          : isSelected
            ? "border-primary bg-primary/10"
            : "border-border hover:border-border/80",
        className,
      )}
      onClick={handleClick}
      disabled={hasVoted}
    >
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2 text-sm">
          {isUserVote && <CheckSquare className="size-3.5" />}
          {option.text}
        </span>
        {showPercentages && (
          <span className="text-xs text-muted-foreground">
            {percentage.toFixed(1)}% ({option.votes})
          </span>
        )}
      </div>

      {showPercentages && (
        <div className="mt-2">
          <PollProgressBar percentage={percentage} isUserVote={isUserVote} />
        </div>
      )}
    </button>
  );
}
