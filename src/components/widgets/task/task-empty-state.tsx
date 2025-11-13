import { CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWidget } from "../widget/WidgetProvider";

interface TaskEmptyStateProps {
  className?: string;
}

export function TaskEmptyState({ className }: TaskEmptyStateProps) {
  const { actions } = useWidget();

  return (
    <div
      className={`text-center flex flex-col flex-1 items-center justify-center text-muted-foreground space-y-2 ${className || ""}`}
    >
      <div className="flex items-center justify-center gap-2">
        <CheckSquare className="h-4 w-4" />
        No task configured
      </div>
      <div className="text-sm">Add a task title and details to get started</div>
      <Button
        variant="secondary"
        className="mt-2"
        size="sm"
        onClick={actions.openConfig}
      >
        Configure Task
      </Button>
    </div>
  );
}
