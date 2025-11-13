import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { useWidget } from "./WidgetProvider";
import { useCanvasContext } from "@/components/canvas/CanvasContext";
import { getWidgetDefinitionByType } from "../registry";
import { useWidgetCanvasContext } from "./WidgetCanvasContext";

export interface ResizeInfo {
  delta: {
    x: number;
    y: number;
  };
}

export type ResizeHandle =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "bottom"
  | "left"
  | "right";

export interface PanEvent {
  stopPropagation: () => void;
  preventDefault: () => void;
}

export interface ResizeHandlers {
  onResizeStart: (e: PanEvent) => void;
  onResize: (
    handle: ResizeHandle,
    deltaX: number,
    deltaY: number,
    e: PanEvent,
  ) => void;
  onResizeEnd: () => void;
}

interface WidgetResizableProps {
  children: React.ReactNode;
}

interface HandleProps {
  handle: ResizeHandle;
  className: string;
  style: React.CSSProperties;
  handlers: ResizeHandlers;
}

function Handle({ handle, className, style, handlers }: HandleProps) {
  return (
    <motion.div
      className={className}
      style={style}
      onPanStart={handlers.onResizeStart}
      onPan={(_, info) =>
        handlers.onResize(handle, info.delta.x, info.delta.y, _)
      }
      onPanEnd={handlers.onResizeEnd}
    />
  );
}

export function WidgetResizable({ children }: WidgetResizableProps) {
  const { widget, actions } = useWidget();
  const { viewport, hasWriteAccess } = useCanvasContext();
  const { state: canvasState, setIsResizing } = useWidgetCanvasContext();

  const widgetDefinition = getWidgetDefinitionByType(widget.widgetType);

  const MIN_WIDTH = widgetDefinition?.size.min.width ?? 200;
  const MIN_HEIGHT = widgetDefinition?.size.min.height ?? 150;

  const handleResizeStart = useCallback(
    (e: PanEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setIsResizing(true);
    },
    [setIsResizing],
  );

  const handleResize = useCallback(
    (handle: ResizeHandle, deltaX: number, deltaY: number, e: PanEvent) => {
      e.stopPropagation();
      if (!hasWriteAccess) return;

      const worldDeltaX = deltaX / viewport.zoom;
      const worldDeltaY = deltaY / viewport.zoom;

      let newSize = { ...widget.size };
      let newPosition = { ...widget.position };

      switch (handle) {
        case "top-left":
          newSize.width = Math.max(MIN_WIDTH, widget.size.width - worldDeltaX);
          newSize.height = Math.max(
            MIN_HEIGHT,
            widget.size.height - worldDeltaY,
          );
          newPosition.x =
            widget.position.x + (widget.size.width - newSize.width);
          newPosition.y =
            widget.position.y + (widget.size.height - newSize.height);
          break;
        case "top-right":
          newSize.width = Math.max(MIN_WIDTH, widget.size.width + worldDeltaX);
          newSize.height = Math.max(
            MIN_HEIGHT,
            widget.size.height - worldDeltaY,
          );
          newPosition.y =
            widget.position.y + (widget.size.height - newSize.height);
          break;
        case "bottom-left":
          newSize.width = Math.max(MIN_WIDTH, widget.size.width - worldDeltaX);
          newSize.height = Math.max(
            MIN_HEIGHT,
            widget.size.height + worldDeltaY,
          );
          newPosition.x =
            widget.position.x + (widget.size.width - newSize.width);
          break;
        case "bottom-right":
          newSize.width = Math.max(MIN_WIDTH, widget.size.width + worldDeltaX);
          newSize.height = Math.max(
            MIN_HEIGHT,
            widget.size.height + worldDeltaY,
          );
          break;
        case "top":
          newSize.height = Math.max(
            MIN_HEIGHT,
            widget.size.height - worldDeltaY,
          );
          newPosition.y =
            widget.position.y + (widget.size.height - newSize.height);
          break;
        case "bottom":
          newSize.height = Math.max(
            MIN_HEIGHT,
            widget.size.height + worldDeltaY,
          );
          break;
        case "left":
          newSize.width = Math.max(MIN_WIDTH, widget.size.width - worldDeltaX);
          newPosition.x =
            widget.position.x + (widget.size.width - newSize.width);
          break;
        case "right":
          newSize.width = Math.max(MIN_WIDTH, widget.size.width + worldDeltaX);
          break;
      }

      actions.updateSize(newSize);
      if (
        newPosition.x !== widget.position.x ||
        newPosition.y !== widget.position.y
      ) {
        actions.updatePosition(newPosition);
      }
    },
    [
      widget.size,
      widget.position,
      viewport.zoom,
      hasWriteAccess,
      actions,
      MIN_WIDTH,
      MIN_HEIGHT,
    ],
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, [setIsResizing]);

  const handlers = {
    onResizeStart: handleResizeStart,
    onResize: handleResize,
    onResizeEnd: handleResizeEnd,
  };

  return (
    <div
      className={`relative w-full h-full ${canvasState.isSelected ? "outline-3 outline-blue-500" : ""}`}
    >
      {children}
      {canvasState.isSelected && (
        <>
          {/* Corner handles */}
          <Handle
            handle="top-left"
            className="absolute size-3.5 bg-background border-blue-500 border-3 rounded shadow-sm cursor-nw-resize"
            style={{ top: -9, left: -9 }}
            handlers={handlers}
          />
          <Handle
            handle="top-left"
            className="absolute cursor-nw-resize"
            style={{ top: -20, left: -20, width: 32, height: 32 }}
            handlers={handlers}
          />

          <Handle
            handle="top-right"
            className="absolute size-3.5 bg-background border-blue-500 border-3 rounded shadow-sm cursor-ne-resize"
            style={{ top: -9, right: -9 }}
            handlers={handlers}
          />
          <Handle
            handle="top-right"
            className="absolute cursor-ne-resize"
            style={{ top: -20, right: -20, width: 32, height: 32 }}
            handlers={handlers}
          />

          <Handle
            handle="bottom-left"
            className="absolute size-3.5 bg-background border-blue-500 border-3 rounded shadow-sm cursor-sw-resize"
            style={{ bottom: -9, left: -9 }}
            handlers={handlers}
          />
          <Handle
            handle="bottom-left"
            className="absolute cursor-sw-resize"
            style={{ bottom: -20, left: -20, width: 32, height: 32 }}
            handlers={handlers}
          />

          <Handle
            handle="bottom-right"
            className="absolute size-3.5 bg-background border-blue-500 border-3 rounded shadow-sm cursor-se-resize"
            style={{ bottom: -9, right: -9 }}
            handlers={handlers}
          />
          <Handle
            handle="bottom-right"
            className="absolute cursor-se-resize"
            style={{ bottom: -20, right: -20, width: 32, height: 32 }}
            handlers={handlers}
          />

          {/* Edge resize zones */}
          <Handle
            handle="top"
            className="absolute cursor-n-resize"
            style={{ top: -8, left: 24, right: 24, height: 16 }}
            handlers={handlers}
          />
          <Handle
            handle="bottom"
            className="absolute cursor-s-resize"
            style={{ bottom: -8, left: 24, right: 24, height: 16 }}
            handlers={handlers}
          />
          <Handle
            handle="left"
            className="absolute cursor-w-resize"
            style={{ left: -8, top: 24, bottom: 24, width: 16 }}
            handlers={handlers}
          />
          <Handle
            handle="right"
            className="absolute cursor-e-resize"
            style={{ right: -8, top: 24, bottom: 24, width: 16 }}
            handlers={handlers}
          />
        </>
      )}
    </div>
  );
}
