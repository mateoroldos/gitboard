interface PollEmptyStateProps {
  className?: string;
}

export function PollEmptyState({ className }: PollEmptyStateProps) {
  return (
    <div className={`text-center text-muted-foreground space-y-2 ${className || ""}`}>
      <div>📊 No poll configured</div>
      <div className="text-sm">Add a question and options to get started</div>
    </div>
  );
}