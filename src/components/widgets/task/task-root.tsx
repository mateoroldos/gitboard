import { ReactNode } from "react";
import { TaskProvider } from "./task-context";
import { useWidget } from "../WidgetProvider";
import type { TaskConfig } from "./types";

interface TaskRootProps {
  children: ReactNode;
  className?: string;
}

export function TaskRoot({ children, className }: TaskRootProps) {
  const { widget, state } = useWidget<TaskConfig>();

  return (
    <div className={className}>
      <TaskProvider widget={widget} isEditing={state.isEditing}>
        {children}
      </TaskProvider>
    </div>
  );
}