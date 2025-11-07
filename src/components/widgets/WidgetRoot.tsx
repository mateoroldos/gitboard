import type React from "react";

interface WidgetRootProps {
  children: React.ReactNode;
  title?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
}

export function WidgetRoot({
  children,
  title,
  onEdit,
  onDelete,
  isEditing = false,
}: WidgetRootProps) {
  return (
    <div
      className={`group border rounded-lg bg-card p-4 shadow-sm transition-all ${
        isEditing ? "ring-2 ring-primary ring-opacity-50" : ""
      }`}
    >
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-sm">{title}</h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && !isEditing && (
              <button
                type="button"
                onClick={onEdit}
                className="p-1 hover:bg-accent rounded text-xs transition-colors"
                aria-label="Edit widget"
                title="Configure widget"
              >
                ⚙️
              </button>
            )}
            {onDelete && !isEditing && (
              <button
                type="button"
                onClick={onDelete}
                className="p-1 hover:bg-destructive hover:text-destructive-foreground rounded text-xs transition-colors"
                aria-label="Delete widget"
                title="Delete widget"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      )}
      <div className="widget-content">{children}</div>
    </div>
  );
}
