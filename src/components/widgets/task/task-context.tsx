import { createContext, useContext, ReactNode } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import type { WidgetInstance } from "../types";
import type { TaskData, TaskConfig } from "./types";
import { createPreviewTaskData } from "./utils";

export interface TaskContextValue {
  taskData: TaskData | null;
  isEditing: boolean;
}

export const TaskContext = createContext<TaskContextValue | null>(null);

interface TaskProviderProps {
  children: ReactNode;
  widget: WidgetInstance<TaskConfig>;
  isEditing?: boolean;
}

export function TaskProvider({
  children,
  widget,
  isEditing = false,
}: TaskProviderProps) {
  // Use backend data for live widgets, preview data for editing
  const { data: taskData } = useSuspenseQuery({
    ...convexQuery(api.task.getTaskData, { widgetId: widget._id }),
    enabled: !isEditing,
  });

  // For editing mode, use preview data
  const previewData = isEditing ? createPreviewTaskData(widget.config) : null;

  const contextValue: TaskContextValue = {
    taskData: isEditing ? previewData : taskData,
    isEditing,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
}