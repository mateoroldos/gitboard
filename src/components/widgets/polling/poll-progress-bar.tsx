import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface PollProgressBarProps {
  percentage: number;
  isUserVote?: boolean;
  className?: string;
}

export function PollProgressBar({ 
  percentage, 
  isUserVote = false, 
  className 
}: PollProgressBarProps) {
  return (
    <Progress 
      value={percentage}
      className={cn(
        "[&>[data-slot=progress-indicator]]:transition-all",
        isUserVote 
          ? "[&>[data-slot=progress-indicator]]:bg-primary" 
          : "[&>[data-slot=progress-indicator]]:bg-primary/80",
        className
      )}
    />
  );
}