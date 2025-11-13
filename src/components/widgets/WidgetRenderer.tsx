import { getWidgetDefinitionByType } from "./registry";
import { WidgetInstance } from "./types";
import { WidgetCanvasProvider } from "./widget/WidgetCanvasContext";
import { WidgetCanvasBase } from "./widget/WidgetCanvasBase";
import { WidgetCard } from "./widget/WidgetCard";
import { WidgetDraggable } from "./widget/WidgetDraggable";
import { WidgetProvider } from "./widget/WidgetProvider";
import { WidgetResizable } from "./widget/WidgetResizable";
import { WidgetContextMenu } from "./widget/WidgetContextMenu";
import { WidgetEditingOverlay } from "./widget/WidgetEditingOverlay";

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
        <WidgetCanvasBase>
          <WidgetDraggable>
            <WidgetResizable>
              <WidgetContextMenu>
                <WidgetCard>
                  <div className="p-4 border border-destructive/40 rounded-lg bg-destructive/10 group">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-destructive">
                        Unknown Widget
                      </h3>
                    </div>
                    <p className="text-sm text-destructive/80">
                      Widget type "{widget.widgetType}" not found in registry.
                    </p>
                    <p className="text-xs text-destructive/60 mt-2">
                      This widget may have been removed or renamed. You can
                      safely delete it.
                    </p>
                  </div>
                </WidgetCard>
              </WidgetContextMenu>
            </WidgetResizable>
          </WidgetDraggable>
        </WidgetCanvasBase>
      </WidgetProvider>
    );
  }

  const WidgetComponent =
    isEditing && widgetDef.previewComponent
      ? widgetDef.previewComponent
      : widgetDef.component;

  const shouldUseCard = widgetDef.renderStyle !== "raw";

  if (!isEditing) {
    return (
      <WidgetProvider
        widget={widget}
        isEditing={isEditing}
        isPreview={isEditing}
        onConfigChange={onConfigChange}
      >
        <WidgetCanvasProvider>
          <WidgetCanvasBase>
            <WidgetDraggable>
              <WidgetResizable>
                <WidgetContextMenu>
                  <WidgetEditingOverlay>
                    <WidgetCard>
                      <WidgetComponent />
                    </WidgetCard>
                  </WidgetEditingOverlay>
                </WidgetContextMenu>
              </WidgetResizable>
            </WidgetDraggable>
          </WidgetCanvasBase>
        </WidgetCanvasProvider>
      </WidgetProvider>
    );
  }

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
