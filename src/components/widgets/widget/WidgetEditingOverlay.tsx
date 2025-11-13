import React from "react";
import { useWidget } from "./WidgetProvider";
import { useCanvasContext } from "@/components/canvas/CanvasContext";
import { getWidgetDefinitionByType } from "../registry";
import { useWidgetCanvasContext } from "./WidgetCanvasContext";

interface WidgetEditingOverlayProps {
  children: React.ReactNode;
}

export function WidgetEditingOverlay({ children }: WidgetEditingOverlayProps) {
  const { widget } = useWidget();
  const { hasWriteAccess } = useCanvasContext();
  const { state } = useWidgetCanvasContext();

  const widgetDefinition = getWidgetDefinitionByType(widget.widgetType);

  const CustomEditingComponent = widgetDefinition?.customEditingComponent;

  return (
    <>
      {children}
      {state.isSelected && hasWriteAccess && CustomEditingComponent && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative w-full h-full">
            <CustomEditingComponent />
          </div>
        </div>
      )}
    </>
  );
}

