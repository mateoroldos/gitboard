import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { useWidget } from "./WidgetProvider";
import { getWidgetDefinitionByType } from "../registry";
import { useWidgetCanvasContext } from "./WidgetCanvasContext";
import { useCanvasContext } from "@/components/canvas/CanvasContext";

interface WidgetDraggableProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function WidgetDraggable({
  children,
  style = {},
  className = "",
  onClick,
}: WidgetDraggableProps) {
  const { widget, actions } = useWidget();
  const { viewport, hasWriteAccess } = useCanvasContext();
  const { state: canvasState, setIsDragging } = useWidgetCanvasContext();

  const widgetDefinition = getWidgetDefinitionByType(widget.widgetType);

  const handleDragEnd = useCallback(
    (
      _event: any,
      info: {
        offset: {
          x: number;
          y: number;
        };
      },
    ) => {
      if (canvasState.isResizing) return;

      setIsDragging(false);

      const worldOffsetX = info.offset.x / viewport.zoom;
      const worldOffsetY = info.offset.y / viewport.zoom;

      const newPosition = {
        x: Math.round(widget.position.x + worldOffsetX),
        y: Math.round(widget.position.y + worldOffsetY),
      };

      if (hasWriteAccess) {
        actions.updatePosition(newPosition);
      }
    },
    [
      canvasState.isResizing,
      widget.position,
      actions.updatePosition,
      hasWriteAccess,
      viewport.zoom,
      setIsDragging,
    ],
  );

  return (
    <motion.div
      data-widget
      drag={!canvasState.isResizing}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => {
        if (!canvasState.isResizing) {
          setIsDragging(true);
        }
      }}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      initial={{
        x: (widget.position.x + viewport.x) * viewport.zoom,
        y: (widget.position.y + viewport.y) * viewport.zoom,
        scale: viewport.zoom,
        width: widget.size.width,
        height: widget.size.height,
      }}
      animate={{
        x: (widget.position.x + viewport.x) * viewport.zoom,
        y: (widget.position.y + viewport.y) * viewport.zoom,
        scale: viewport.zoom,
        width: widget.size.width,
        height: widget.size.height,
      }}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        cursor: !canvasState.isResizing ? "grab" : "default",
        zIndex: canvasState.isDragging || canvasState.isResizing ? 10 : 0,
        transformOrigin: "0 0",
        ...style,
      }}
      className={`shadow-transparent ${className}`}
      whileDrag={{
        scale: 1.02 * viewport.zoom,
        opacity: 0.9,
        boxShadow:
          widgetDefinition?.renderStyle === "card"
            ? "0 8px 14px rgba(0,0,0,0.1)"
            : "",
        cursor: "grabbing",
        zIndex: 1000,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  );
}
