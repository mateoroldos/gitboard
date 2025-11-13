import { cn } from "@/lib/utils";
import { usePoll } from "./poll-state-context";

interface PollQuestionProps {
  className?: string;
}

export function PollQuestion({ className }: PollQuestionProps) {
  const { pollData } = usePoll();

  if (!pollData?.question) {
    return null;
  }

  return (
    <h3 className={cn("font-medium pr-4", className)}>{pollData.question}</h3>
  );
}
