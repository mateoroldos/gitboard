import { Button } from "@/components/ui/button";
import { WidgetRoot } from "../WidgetRoot";
import { Loader } from "lucide-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { WidgetInstance } from "../types";

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollData {
  question: string;
  options: PollOption[];
  showPercentages: boolean;
}

interface PollingDisplayProps {
  widget: WidgetInstance;
  pollData: PollData | null;
  userVote?: { optionId: string } | null;
  selectedOption?: string | null;
  onOptionSelect?: (optionId: string) => void;
  onVote?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isVoting?: boolean;
  isEditing?: boolean;
}

export function PollingDisplay({
  widget,
  pollData,
  userVote,
  selectedOption,
  onOptionSelect,
  onVote,
  onEdit,
  onDelete,
  isVoting = false,
  isEditing = false,
}: PollingDisplayProps) {
  if (!pollData || !pollData.question || pollData.options.length === 0) {
    return (
      <WidgetRoot widget={widget} onEdit={onEdit} onDelete={onDelete}>
        <div className="text-center text-muted-foreground space-y-2">
          <div>📊 No poll configured</div>
        </div>
      </WidgetRoot>
    );
  }

  const totalVotes = pollData.options.reduce(
    (sum, option) => sum + option.votes,
    0,
  );
  const hasVoted = !!userVote;

  return (
    <WidgetRoot widget={widget} onEdit={onEdit} onDelete={onDelete}>
      <div className="space-y-4">
        <h3 className="font-semibold">{pollData.question}</h3>

        <div className="space-y-2">
          {pollData.options.map((option) => {
            const percentage =
              totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const isSelected = selectedOption === option.id;
            const isUserVote = userVote?.optionId === option.id;

            return (
              <button
                key={option.id}
                type="button"
                className={`w-full p-3 border rounded-lg transition-colors text-left ${
                  hasVoted
                    ? isUserVote
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                    : isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  !hasVoted && !isEditing && onOptionSelect?.(option.id)
                }
                disabled={hasVoted || isEditing}
              >
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    {option.text}
                    {isUserVote && (
                      <span className="text-green-600 text-sm">
                        ✓ Your vote
                      </span>
                    )}
                  </span>
                  {pollData.showPercentages && (
                    <span className="text-sm text-muted-foreground">
                      {percentage.toFixed(1)}% ({option.votes})
                    </span>
                  )}
                </div>

                {pollData.showPercentages && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isUserVote ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <Authenticated>
          {!hasVoted && !isEditing && (
            <Button
              onClick={onVote}
              disabled={!selectedOption || isVoting}
              className="w-full"
            >
              {isVoting && <Loader className="animate-spin" />}
              {isVoting ? "Voting" : "Vote"}
            </Button>
          )}
        </Authenticated>

        <div className="text-sm text-muted-foreground text-center">
          Total votes: {totalVotes}
          {hasVoted && (
            <div className="text-green-600">You have voted in this poll</div>
          )}
        </div>

        <Unauthenticated>
          <p className="text-xs text-muted-foreground text-center">
            Sign in to vote
          </p>
        </Unauthenticated>
      </div>
    </WidgetRoot>
  );
}
