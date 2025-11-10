import { usePoll } from "./poll-context";
import { cn } from "@/lib/utils";

interface PollQuestionProps {
  className?: string;
}

export function PollQuestion({ className }: PollQuestionProps) {
  const { pollData } = usePoll();

  if (!pollData?.question) {
    return null;
  }

  return (
    <h3 className={cn("font-semibold", className)}>
      {pollData.question}
    </h3>
  );
}