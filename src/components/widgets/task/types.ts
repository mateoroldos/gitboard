export type TaskStatus = "Not Started" | "In Progress" | "Completed" | "Cancelled";
export type TaskPriority = "High" | "Medium" | "Low";

export interface TaskData {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  targetDate?: string;
  githubPR?: string;
}

export interface TaskConfig {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  targetDate: string;
  githubPR: string;
}