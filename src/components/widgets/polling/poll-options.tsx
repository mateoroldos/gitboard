import { ReactNode } from "react";
import { usePoll } from "./poll-context";
import { PollOptionComponent } from "./poll-option";
import { cn } from "@/lib/utils";

interface PollOptionsProps {
  children?: ReactNode;
  variant?: "default" | "compact";
  className?: string;
}

export function PollOptions({
  children,
  variant = "default",
  className,
}: PollOptionsProps) {
  const { pollData } = usePoll();

  if (!pollData?.options || pollData.options.length === 0) {
    return null;
  }

  const spacing = variant === "compact" ? "space-y-1" : "space-y-2";

  return (
    <div className={cn(spacing, className)}>
      {children ||
        pollData.options.map((option) => (
          <PollOptionComponent
            key={option.id}
            option={option}
            showPercentages={pollData.showPercentages}
            className={variant === "compact" ? "p-2 text-sm" : undefined}
          />
        ))}
    </div>
  );
}

