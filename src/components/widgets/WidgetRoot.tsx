import React from "react";

interface WidgetRootProps {
  children: React.ReactNode;
  title?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function WidgetRoot({
  children,
  title,
  onEdit,
  onDelete,
}: WidgetRootProps) {
  return (
    <div className="border rounded-lg bg-card p-4 shadow-sm">
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-sm">{title}</h3>
          <div className="flex gap-1">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1 hover:bg-accent rounded text-xs"
                aria-label="Edit widget"
              >
                ⚙️
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1 hover:bg-accent rounded text-xs"
                aria-label="Delete widget"
              >
                ❌
              </button>
            )}
          </div>
        </div>
      )}
      <div className="widget-content">{children}</div>
    </div>
  );
}
