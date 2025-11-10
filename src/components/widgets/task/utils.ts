import type { TaskData, TaskConfig, TaskStatus, TaskPriority } from "./types";

export function createPreviewTaskData(config: TaskConfig): TaskData | null {
  if (!config.title) {
    return null;
  }

  return {
    title: config.title,
    description: config.description,
    status: isValidStatus(config.status) ? config.status : "Not Started",
    priority: isValidPriority(config.priority) ? config.priority : "Medium",
    targetDate: config.targetDate,
    githubPR: config.githubPR,
  };
}

function isValidStatus(status: string): status is TaskStatus {
  return ["Not Started", "In Progress", "Completed", "Cancelled"].includes(status);
}

function isValidPriority(priority: string): priority is TaskPriority {
  return ["High", "Medium", "Low"].includes(priority);
}

export function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case "Not Started":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "In Progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function getPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 border-red-200";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}