import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useWidget } from "./WidgetProvider";
import { useCanvasContext } from "@/components/canvas/CanvasContext";
import { getWidgetDefinitionByType } from "./registry";
import { EditingOverlay } from "./EditingOverlay";

interface WidgetCanvasProps {
  children: React.ReactNode;
  isDraggable?: boolean;
  isResizable?: boolean;
}

export function WidgetCanvas({
  children,
  isDraggable = true,
  isResizable = true,
}: WidgetCanvasProps) {
  const { widget, actions, state } = useWidget();
  const { viewport, selectedWidgetId, setSelectedWidgetId } =
    useCanvasContext();

  const widgetDefinition = getWidgetDefinitionByType(widget.widgetType);

  const MIN_WIDTH = widgetDefinition?.size.min.width ?? 200;
  const MIN_HEIGHT = widgetDefinition?.size.min.height ?? 150;

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const isSelected = selectedWidgetId === widget._id;

  const handleDragEnd = useCallback(
    (_event: any, info: any) => {
      if (isResizing) return;

      setIsDragging(false);

      const worldOffsetX = info.offset.x / viewport.zoom;
      const worldOffsetY = info.offset.y / viewport.zoom;

      const newPosition = {
        x: Math.round(widget.position.x + worldOffsetX),
        y: Math.round(widget.position.y + worldOffsetY),
      };

      if (state.hasWriteAccess) {
        actions.updatePosition(newPosition);
      }
    },
    [
      isResizing,
      widget.position,
      actions.updatePosition,
      state.hasWriteAccess,
      viewport.zoom,
    ],
  );

  const handleResizeStart = useCallback((e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleResize = useCallback(
    (handle: string, deltaX: number, deltaY: number, e: any) => {
      e.stopPropagation();
      if (!state.hasWriteAccess) return;

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
      state.hasWriteAccess,
      actions,
    ],
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  return (
    <motion.div
      data-widget
      drag={isDraggable && !isResizing}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => {
        if (!isResizing) {
          setIsDragging(true);
        }
      }}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedWidgetId(widget._id);
      }}
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
        cursor: isDraggable && !isResizing ? "grab" : "default",
        zIndex: isDragging || isResizing ? 1000 : 0,
        transformOrigin: "0 0",
      }}
      className={`${isSelected && state.hasWriteAccess ? "outline-3 outline-blue-500" : ""}`}
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

      {isSelected && state.hasWriteAccess && (
        <>
          <EditingOverlay>
            {isResizable && (
              <>
                {/* Corner handles */}
                <motion.div
                  className="absolute size-3.5 bg-background border-blue-500 border-3 rounded shadow-sm cursor-nw-resize"
                  style={{ top: -9, left: -9 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("top-left", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />
                <motion.div
                  className="absolute cursor-nw-resize"
                  style={{ top: -20, left: -20, width: 32, height: 32 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("top-left", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />
                
                <motion.div
                  className="absolute size-3.5 bg-background border-blue-500 border-3 rounded shadow-sm cursor-ne-resize"
                  style={{ top: -9, right: -9 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("top-right", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />
                <motion.div
                  className="absolute cursor-ne-resize"
                  style={{ top: -20, right: -20, width: 32, height: 32 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("top-right", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />
                
                <motion.div
                  className="absolute size-3.5 bg-background border-blue-500 border-3 rounded shadow-sm cursor-sw-resize"
                  style={{ bottom: -9, left: -9 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("bottom-left", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />
                <motion.div
                  className="absolute cursor-sw-resize"
                  style={{ bottom: -20, left: -20, width: 32, height: 32 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("bottom-left", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />
                
                <motion.div
                  className="absolute size-3.5 bg-background border-blue-500 border-3 rounded shadow-sm cursor-se-resize"
                  style={{ bottom: -9, right: -9 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("bottom-right", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />
                <motion.div
                  className="absolute cursor-se-resize"
                  style={{ bottom: -20, right: -20, width: 32, height: 32 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("bottom-right", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />

                {/* Edge resize zones */}
                <motion.div
                  className="absolute cursor-n-resize"
                  style={{ top: -8, left: 24, right: 24, height: 16 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("top", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />
                <motion.div
                  className="absolute cursor-s-resize"
                  style={{ bottom: -8, left: 24, right: 24, height: 16 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("bottom", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />
                <motion.div
                  className="absolute cursor-w-resize"
                  style={{ left: -8, top: 24, bottom: 24, width: 16 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("left", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />
                <motion.div
                  className="absolute cursor-e-resize"
                  style={{ right: -8, top: 24, bottom: 24, width: 16 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("right", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />
              </>
            )}
          </EditingOverlay>
        </>
      )}
    </motion.div>
  );
}
