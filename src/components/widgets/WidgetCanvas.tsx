import React, { useCallback, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useWidget } from "./WidgetProvider";
import { useCanvasContext } from "@/components/canvas/CanvasContext";
import debounce from "debounce";
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
  const [localPosition, setLocalPosition] = useState(widget.position);
  const [localSize, setLocalSize] = useState(widget.size);

  const isSelected = selectedWidgetId === widget._id;

  const debouncedUpdatePosition = useMemo(() => {
    return debounce((newPosition: { x: number; y: number }) => {
      actions.updatePosition(newPosition);
    }, 500);
  }, [actions.updatePosition]);

  const debouncedUpdateSize = useMemo(() => {
    return debounce((newSize: { width: number; height: number }) => {
      actions.updateSize(newSize);
    }, 500);
  }, [actions.updateSize]);

  const handleDragEnd = useCallback(
    (_event: any, info: any) => {
      if (isResizing) return;

      setIsDragging(false);

      const worldOffsetX = info.offset.x / viewport.zoom;
      const worldOffsetY = info.offset.y / viewport.zoom;

      const newPosition = {
        x: Math.round(localPosition.x + worldOffsetX),
        y: Math.round(localPosition.y + worldOffsetY),
      };

      if (state.hasWriteAccess) {
        setLocalPosition(newPosition);
        debouncedUpdatePosition(newPosition);
      } else {
        setLocalPosition(widget.position);
      }
    },
    [
      isResizing,
      localPosition,
      debouncedUpdatePosition,
      state.hasWriteAccess,
      widget.position,
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

      let newSize = { ...localSize };
      let newPosition = { ...localPosition };

      switch (handle) {
        case "top-left":
          newSize.width = Math.max(MIN_WIDTH, localSize.width - worldDeltaX);
          newSize.height = Math.max(MIN_HEIGHT, localSize.height - worldDeltaY);
          newPosition.x = localPosition.x + (localSize.width - newSize.width);
          newPosition.y = localPosition.y + (localSize.height - newSize.height);
          break;
        case "top-right":
          newSize.width = Math.max(MIN_WIDTH, localSize.width + worldDeltaX);
          newSize.height = Math.max(MIN_HEIGHT, localSize.height - worldDeltaY);
          newPosition.y = localPosition.y + (localSize.height - newSize.height);
          break;
        case "bottom-left":
          newSize.width = Math.max(MIN_WIDTH, localSize.width - worldDeltaX);
          newSize.height = Math.max(MIN_HEIGHT, localSize.height + worldDeltaY);
          newPosition.x = localPosition.x + (localSize.width - newSize.width);
          break;
        case "bottom-right":
          newSize.width = Math.max(MIN_WIDTH, localSize.width + worldDeltaX);
          newSize.height = Math.max(MIN_HEIGHT, localSize.height + worldDeltaY);
          break;
        case "top":
          newSize.height = Math.max(MIN_HEIGHT, localSize.height - worldDeltaY);
          newPosition.y = localPosition.y + (localSize.height - newSize.height);
          break;
        case "bottom":
          newSize.height = Math.max(MIN_HEIGHT, localSize.height + worldDeltaY);
          break;
        case "left":
          newSize.width = Math.max(MIN_WIDTH, localSize.width - worldDeltaX);
          newPosition.x = localPosition.x + (localSize.width - newSize.width);
          break;
        case "right":
          newSize.width = Math.max(MIN_WIDTH, localSize.width + worldDeltaX);
          break;
      }

      setLocalSize(newSize);
      setLocalPosition(newPosition);
    },
    [localSize, localPosition, viewport.zoom, state.hasWriteAccess],
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    if (state.hasWriteAccess) {
      debouncedUpdateSize(localSize);
    } else {
      setLocalSize(widget.size);
    }
  }, [localSize, debouncedUpdateSize, state.hasWriteAccess, widget.size]);

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
        x: (localPosition.x + viewport.x) * viewport.zoom,
        y: (localPosition.y + viewport.y) * viewport.zoom,
        scale: viewport.zoom,
        width: localSize.width,
        height: localSize.height,
      }}
      animate={{
        x: (localPosition.x + viewport.x) * viewport.zoom,
        y: (localPosition.y + viewport.y) * viewport.zoom,
        scale: viewport.zoom,
        width: localSize.width,
        height: localSize.height,
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
                  style={{ top: -6, left: -6 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("top-left", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />
                <motion.div
                  className="absolute size-3.5 bg-background border-blue-500 border-3 rounded shadow-sm cursor-nw-resize"
                  style={{ top: -6, right: -6 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("top-right", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />
                <motion.div
                  className="absolute size-3.5 bg-background border-blue-500 border-3 rounded shadow-sm cursor-nw-resize"
                  style={{ bottom: -6, left: -6 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("bottom-left", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />
                <motion.div
                  className="absolute size-3.5 bg-background border-blue-500 border-3 rounded shadow-sm cursor-nw-resize"
                  style={{ bottom: -6, right: -6 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("bottom-right", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />

                {/* Edge resize zones */}
                <motion.div
                  className="absolute cursor-n-resize"
                  style={{ top: 0, left: 0, right: 0, height: 4 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("top", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />
                <motion.div
                  className="absolute cursor-s-resize"
                  style={{ bottom: 0, left: 0, right: 0, height: 4 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("bottom", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />
                <motion.div
                  className="absolute cursor-w-resize"
                  style={{ left: 0, top: 0, bottom: 0, width: 4 }}
                  onPanStart={handleResizeStart}
                  onPan={(_, info) =>
                    handleResize("left", info.delta.x, info.delta.y, _)
                  }
                  onPanEnd={handleResizeEnd}
                />
                <motion.div
                  className="absolute cursor-e-resize"
                  style={{ right: 0, top: 0, bottom: 0, width: 4 }}
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
