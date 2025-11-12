import { Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWidget } from "./WidgetProvider";
import { getWidgetDefinitionByType } from "./registry";

export function DefaultEditingOverlay() {
  const { actions, widget } = useWidget();

  const widgetDefinition = getWidgetDefinitionByType(widget.widgetType);

  return (
    <>
      {widgetDefinition?.configSchema && (
        <div className="absolute -top-12 left-2 pointer-events-none">
          <Button
            variant="secondary"
            size="sm"
            className="pointer-events-auto shadow-lg"
            onClick={() => actions.openConfig()}
            title="Configure widget"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      )}

      {/* Delete Button - Top Right */}
      <div className="absolute -top-12 right-2 pointer-events-none">
        <Button
          variant="destructive"
          size="sm"
          className="h-8 w-8 p-0 pointer-events-auto shadow-lg"
          onClick={() => actions.deleteWidget()}
          title="Delete widget"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
