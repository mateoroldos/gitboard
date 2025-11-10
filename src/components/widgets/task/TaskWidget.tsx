import { TaskRoot } from "./task-root";
import { TaskDisplay } from "./task-display";
import { TaskEmptyState } from "./task-empty-state";
import { useTask } from "./task-context";

function TaskContent() {
  const { taskData } = useTask();

  if (!taskData || !taskData.title) {
    return <TaskEmptyState />;
  }

  return <TaskDisplay />;
}

export function TaskWidget() {
  return (
    <TaskRoot>
      <TaskContent />
    </TaskRoot>
  );
}