import { TaskContext } from "./task-context";
import { TaskDisplay } from "./task-display";
import { TaskEmptyState } from "./task-empty-state";
import type { TaskConfig } from "./types";
import { createPreviewTaskData } from "./utils";
import { useWidget } from "../WidgetProvider";

export function TaskPreview() {
  const { widget } = useWidget();
  const config = widget.config as TaskConfig;
  const taskData = createPreviewTaskData(config);

  const contextValue = {
    taskData,
    isEditing: true,
  };

  return (
    <>
      {!taskData || !taskData.title ? (
        <TaskEmptyState />
      ) : (
        <TaskContext.Provider value={contextValue}>
          <TaskDisplay />
        </TaskContext.Provider>
      )}
    </>
  );
}