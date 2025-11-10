import { usePollOption, usePollActions } from "./poll-context";
import { PollProgressBar } from "./poll-progress-bar";
import { cn } from "@/lib/utils";
import type { PollOption } from "./types";

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
  const { percentage, isSelected, isUserVote, hasVoted } = usePollOption(
    option.id,
  );
  const { selectOption } = usePollActions();

  const handleClick = () => {
    if (!hasVoted) {
      selectOption(option.id);
    }
  };

  return (
    <button
      type="button"
      className={cn(
        "w-full p-3 border rounded-lg transition-colors text-left",
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
        <span className="flex items-center gap-2">
          {option.text}
          {isUserVote && (
            <span className="text-primary text-sm">✓ Your vote</span>
          )}
        </span>
        {showPercentages && (
          <span className="text-sm text-muted-foreground">
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

