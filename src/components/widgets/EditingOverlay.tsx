import React from "react";
import { useWidget } from "./WidgetProvider";
import { getWidgetDefinitionByType } from "./registry";

interface CustomEditingOverlayProps {
  children?: React.ReactNode;
}

export function EditingOverlay({ children }: CustomEditingOverlayProps) {
  const { widget } = useWidget();
  const widgetDefinition = getWidgetDefinitionByType(widget.widgetType);

  // Only render custom editing components, not the default overlay
  const CustomEditingComponent = widgetDefinition?.customEditingComponent;

  return (
    <>
      {children}
      {CustomEditingComponent && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative w-full h-full">
            <CustomEditingComponent />
          </div>
        </div>
      )}
    </>
  );
}

