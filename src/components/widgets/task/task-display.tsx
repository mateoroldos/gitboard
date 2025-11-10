import { useTask } from "./task-context";
import { getStatusColor, getPriorityColor } from "./utils";
import { cn } from "@/lib/utils";
import { Calendar, ExternalLink, Github } from "lucide-react";

interface TaskDisplayProps {
  className?: string;
}

export function TaskDisplay({ className }: TaskDisplayProps) {
  const { taskData } = useTask();

  if (!taskData) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Title */}
      <h3 className="font-semibold text-lg">{taskData.title}</h3>

      {/* Description */}
      {taskData.description && (
        <p className="text-sm text-muted-foreground">{taskData.description}</p>
      )}

      {/* Status and Priority */}
      <div className="flex gap-2">
        <span
          className={cn(
            "px-2 py-1 text-xs rounded-md border font-medium",
            getStatusColor(taskData.status),
          )}
        >
          {taskData.status}
        </span>
        <span
          className={cn(
            "px-2 py-1 text-xs rounded-md border font-medium",
            getPriorityColor(taskData.priority),
          )}
        >
          {taskData.priority}
        </span>
      </div>

      {/* Target Date and GitHub PR */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex gap-4">
          {taskData.targetDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(taskData.targetDate).toLocaleDateString()}
            </span>
          )}
          {taskData.githubPR && (
            <a
              href={taskData.githubPR}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1"
            >
              <Github className="h-3 w-3" />
              Pull Request
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

