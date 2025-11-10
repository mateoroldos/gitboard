import React, { useCallback, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useWidget } from "./WidgetProvider";
import { useCanvasContext } from "@/components/canvas/CanvasContext";
import debounce from "debounce";

interface WidgetCanvasProps {
  children: React.ReactNode;
  isDraggable?: boolean;
}

export function WidgetCanvas({
  children,
  isDraggable = true,
}: WidgetCanvasProps) {
  const { widget, actions, state } = useWidget();
  const { viewport } = useCanvasContext();

  const [isDragging, setIsDragging] = useState(false);
  const [localPosition, setLocalPosition] = useState(widget.position);

  const debouncedUpdatePosition = useMemo(() => {
    return debounce((newPosition: { x: number; y: number }) => {
      actions.updatePosition(newPosition);
    }, 500);
  }, [actions.updatePosition]);

  const handleDragEnd = useCallback(
    (_event: any, info: any) => {
      setIsDragging(false);

      // Convert screen drag offset to world coordinates
      const worldOffsetY = info.offset.y / viewport.zoom;
      const worldOffsetX = info.offset.x / viewport.zoom;

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
      localPosition,
      debouncedUpdatePosition,
      state.hasWriteAccess,
      widget.position,
      viewport.zoom,
    ],
  );

  return (
    <motion.div
      data-widget
      drag={isDraggable}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      initial={{
        x: (localPosition.x + viewport.x) * viewport.zoom,
        y: (localPosition.y + viewport.y) * viewport.zoom,
        scale: viewport.zoom,
      }}
      animate={{
        x: (localPosition.x + viewport.x) * viewport.zoom,
        y: (localPosition.y + viewport.y) * viewport.zoom,
        scale: viewport.zoom,
      }}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        cursor: isDraggable ? "grab" : "default",
        zIndex: isDragging ? 1000 : 0,
        transformOrigin: "0 0",
      }}
      whileDrag={{
        scale: 1.02 * viewport.zoom,
        opacity: 0.9,
        boxShadow: "0 8px 14px rgba(0,0,0,0.1)",
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
