import { ReactNode } from "react";
import { TaskProvider } from "./task-context";
import { useWidget } from "../WidgetProvider";
import type { TaskConfig } from "./types";

interface TaskRootProps {
  children: ReactNode;
  className?: string;
}

export function TaskRoot({ children }: TaskRootProps) {
  const { widget, state } = useWidget<TaskConfig>();

  return (
    <TaskProvider widget={widget} isEditing={state.isEditing}>
      {children}
    </TaskProvider>
  );
}

