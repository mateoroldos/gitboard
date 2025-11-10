import React, { useCallback, useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAction } from "convex/react";
import { api } from "convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { WidgetInstance } from "./types";
import debounce from "debounce";
import { motion } from "framer-motion";
import { useCanvasContext } from "@/components/CanvasContext";

interface WidgetRootProps {
  children: React.ReactNode;
  widget: WidgetInstance;
  onEdit?: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
  isDraggable?: boolean;
}

export function WidgetRoot({
  children,
  widget,
  onEdit,
  onDelete,
  isEditing = false,
  isDraggable = true,
}: WidgetRootProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localPosition, setLocalPosition] = useState(widget.position);
  const { hasWriteAccess } = useCanvasContext();

  const updatePosition = useMutation({
    mutationFn: useAction(api.widgets.updateWidgetAction),
  });

  const debouncedMutate = useMemo(
    () =>
      debounce((newPosition: { x: number; y: number }) => {
        updatePosition.mutate({
          id: widget._id,
          position: newPosition,
        });
      }, 2000),
    [updatePosition.mutate, widget._id],
  );

  const handleDragEnd = useCallback(
    (_event: any, info: any) => {
      setIsDragging(false);

      const newPosition = {
        x: Math.max(0, Math.round(localPosition.x + info.offset.x)),
        y: Math.max(0, Math.round(localPosition.y + info.offset.y)),
      };

      if (hasWriteAccess) {
        setLocalPosition(newPosition);
        debouncedMutate(newPosition);
      } else {
        // Revert to original position if no write access
        setLocalPosition(widget.position);
      }
    },
    [localPosition, debouncedMutate, hasWriteAccess, widget.position],
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
        x: localPosition.x,
        y: localPosition.y,
      }}
      animate={{
        x: localPosition.x,
        y: localPosition.y,
      }}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        cursor: isDraggable ? "grab" : "default",
        zIndex: isDragging ? 1000 : 0,
      }}
      whileDrag={{
        scale: 1.02,
        opacity: 0.9,
        boxShadow: "0 8px 14px rgba(0,0,0,0.1)",
        cursor: "grabbing",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <Card
        className={`group transition-all ${
          isEditing ? "ring-2 ring-primary ring-opacity-50" : ""
        }`}
      >
        <CardContent>
          {widget.title && (
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">{widget.title}</h3>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && !isEditing && (
                  <button
                    type="button"
                    onClick={onEdit}
                    className="p-1 hover:bg-accent rounded text-xs transition-colors"
                    aria-label="Edit widget"
                    title="Configure widget"
                  >
                    ⚙️
                  </button>
                )}
                {onDelete && !isEditing && (
                  <button
                    type="button"
                    onClick={onDelete}
                    className="p-1 hover:bg-destructive hover:text-destructive-foreground rounded text-xs transition-colors"
                    aria-label="Delete widget"
                    title="Delete widget"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="widget-content">{children}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
