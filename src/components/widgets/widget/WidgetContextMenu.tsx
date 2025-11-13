import React from "react";
import { Settings, Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useWidget } from "./WidgetProvider";
import { getWidgetDefinitionByType } from "../registry";
import { useCanvasContext } from "@/components/canvas/CanvasContext";

interface WidgetContextMenuProps {
  children: React.ReactNode;
}

export function WidgetContextMenu({ children }: WidgetContextMenuProps) {
  const { actions, widget } = useWidget();
  const { hasWriteAccess } = useCanvasContext();
  const widgetDefinition = getWidgetDefinitionByType(widget.widgetType);

  // Only show context menu if user has write access
  if (!hasWriteAccess) {
    return <>{children}</>;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <>{children}</>
      </ContextMenuTrigger>
      <ContextMenuContent className="rounded">
        {widgetDefinition?.configSchema && (
          <>
            <ContextMenuItem onClick={() => actions.openConfig()}>
              <Settings className="h-4 w-4" />
              Settings
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        <ContextMenuItem
          variant="destructive"
          onClick={() => actions.deleteWidget()}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
