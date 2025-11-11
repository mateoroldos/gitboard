import { getWidgetDefinitionByType } from "./registry";
import { WidgetInstance } from "./types";
import { WidgetProvider } from "./WidgetProvider";
import { WidgetCanvas } from "./WidgetCanvas";
import { WidgetCard } from "./WidgetCard";

interface WidgetRendererProps {
  widget: WidgetInstance;
  onConfigChange?: () => void;
  isEditing?: boolean;
}

export function WidgetRenderer({
  widget,
  onConfigChange,
  isEditing = false,
}: WidgetRendererProps) {
  const widgetDef = getWidgetDefinitionByType(widget.widgetType);

  if (!widgetDef) {
    return (
      <WidgetProvider
        widget={widget}
        isEditing={isEditing}
        isPreview={isEditing}
        onConfigChange={onConfigChange}
      >
        <WidgetCanvas>
          <WidgetCard>
            <div className="p-4 border border-destructive/40 rounded-lg bg-destructive/10 group">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-destructive">Unknown Widget</h3>
              </div>
              <p className="text-sm text-destructive/80">
                Widget type "{widget.widgetType}" not found in registry.
              </p>
              <p className="text-xs text-destructive/60 mt-2">
                This widget may have been removed or renamed. You can safely
                delete it.
              </p>
            </div>
          </WidgetCard>
        </WidgetCanvas>
      </WidgetProvider>
    );
  }

  const WidgetComponent =
    isEditing && widgetDef.previewComponent
      ? widgetDef.previewComponent
      : widgetDef.component;

  const shouldUseCard = widgetDef.renderStyle !== "raw";

  // For canvas widgets (not editing/preview), wrap with WidgetCanvas for positioning
  if (!isEditing) {
    return (
      <WidgetProvider
        widget={widget}
        isEditing={isEditing}
        isPreview={isEditing}
        onConfigChange={onConfigChange}
      >
        <WidgetCanvas>
          {shouldUseCard ? (
            <WidgetCard>
              <WidgetComponent />
            </WidgetCard>
          ) : (
            <WidgetComponent />
          )}
        </WidgetCanvas>
      </WidgetProvider>
    );
  }

  // For preview/editing, return the widget directly without canvas positioning
  return (
    <WidgetProvider
      widget={widget}
      isEditing={isEditing}
      isPreview={isEditing}
      onConfigChange={onConfigChange}
    >
      {shouldUseCard ? (
        <WidgetCard>
          <WidgetComponent />
        </WidgetCard>
      ) : (
        <WidgetComponent />
      )}
    </WidgetProvider>
  );
}
