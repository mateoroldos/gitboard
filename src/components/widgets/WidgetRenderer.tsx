import { useMutation } from "@tanstack/react-query";
import { getWidgetById } from "./registry";
import { useAction } from "convex/react";
import { api } from "convex/_generated/api";
import { WidgetInstance } from "./types";
import { useCanvasContext } from "../canvas/CanvasContext";

interface WidgetRendererProps {
  widget: WidgetInstance;
  onConfigChange?: (config: Record<string, any>) => void;
  isEditing?: boolean;
}

export function WidgetRenderer({
  widget,
  onConfigChange,
  isEditing,
}: WidgetRendererProps) {
  const { repoString } = useCanvasContext();

  const widgetDef = getWidgetById(widget.widgetType);

  const { mutate: deleteWidget } = useMutation({
    mutationFn: useAction(api.widgets.deleteWidgetAction),
  });

  const handleDeleteWidget = () => {
    if (confirm("Are you sure you want to delete this widget?")) {
      deleteWidget({ id: widget._id });
    }
  };

  if (!widgetDef) {
    return (
      <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5 group">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-destructive">Unknown Widget</h3>
          <button
            type="button"
            onClick={handleDeleteWidget}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded text-xs transition-all"
            aria-label="Delete widget"
            title="Delete widget"
          >
            🗑️
          </button>
        </div>
        <p className="text-sm text-destructive/80">
          Widget type "{widget.widgetType}" not found in registry.
        </p>
        <p className="text-xs text-destructive/60 mt-2">
          This widget may have been removed or renamed. You can safely delete
          it.
        </p>
      </div>
    );
  }

  const WidgetComponent =
    isEditing && widgetDef.previewComponent
      ? widgetDef.previewComponent
      : widgetDef.component;

  return (
    <WidgetComponent
      widget={widget}
      repository={repoString}
      onConfigChange={onConfigChange}
      onDelete={isEditing ? undefined : handleDeleteWidget}
      isEditing={isEditing}
    />
  );
}
