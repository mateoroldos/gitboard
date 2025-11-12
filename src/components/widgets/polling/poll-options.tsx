import { ReactNode } from "react";
import { usePoll } from "./poll-context";
import { PollOptionComponent } from "./poll-option";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PollOptionsProps {
  children?: ReactNode;
  variant?: "default" | "compact";
  className?: string;
}

export function PollOptions({
  children,
  variant = "default",
  className = "pr-4",
}: PollOptionsProps) {
  const { pollData } = usePoll();

  if (!pollData?.options || pollData.options.length === 0) {
    return null;
  }

  const spacing = variant === "compact" ? "space-y-1" : "space-y-2";

  return (
    <ScrollArea className="min-h-1 flex flex-1 w-full">
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
    </ScrollArea>
  );
}
