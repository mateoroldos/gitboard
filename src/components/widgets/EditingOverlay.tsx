import React from "react";
import { useWidget } from "./WidgetProvider";
import { getWidgetDefinitionByType } from "./registry";
import { DefaultEditingOverlay } from "./DefaultEditingOverlay";

interface CustomEditingOverlayProps {
  children?: React.ReactNode;
}

export function EditingOverlay({ children }: CustomEditingOverlayProps) {
  const { widget } = useWidget();
  const widgetDefinition = getWidgetDefinitionByType(widget.widgetType);

  const EditingComponent =
    widgetDefinition?.customEditingComponent || DefaultEditingOverlay;

  return (
    <>
      {children}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative w-full h-full">
          <EditingComponent />
        </div>
      </div>
    </>
  );
}

