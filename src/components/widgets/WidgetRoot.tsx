import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAction } from "convex/react";
import { api } from "convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { WidgetInstance } from "./types";
import { debounce } from "@/lib/utils";

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
  const [currentPosition, setCurrentPosition] = useState(widget.position);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    startPos: { x: number; y: number };
  }>({
    isDragging: false,
    startPos: { x: 0, y: 0 },
  });

  const updatePosition = useMutation({
    mutationFn: useAction(api.widgets.updateWidgetAction),
  });

  const debounceUpdatePosition = debounce(
    (newPosition: { x: number; y: number }) => {
      updatePosition.mutate({
        id: widget._id,
        position: newPosition,
      });
    },
    500,
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDraggable) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const startPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setDragState({
      isDragging: true,
      startPos,
    });

    // Prevent text selection during drag
    e.preventDefault();
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging) return;

      // Get parent container (canvas)
      const canvas = document.querySelector("[data-canvas]") as HTMLElement;
      if (!canvas) return;

      const parentRect = canvas.getBoundingClientRect();
      const newX = Math.max(
        0,
        e.clientX - parentRect.left - dragState.startPos.x,
      );
      const newY = Math.max(
        0,
        e.clientY - parentRect.top - dragState.startPos.y,
      );

      // Update position immediately (optimistic)
      setCurrentPosition({
        x: newX,
        y: newY,
      });
    },
    [dragState.isDragging, dragState.startPos],
  );

  const handleMouseUp = useCallback(() => {
    if (!dragState.isDragging) return;

    setDragState({
      isDragging: false,
      startPos: { x: 0, y: 0 },
    });

    // Persist current position to database
    debounceUpdatePosition(currentPosition);
  }, [dragState.isDragging, currentPosition, debounceUpdatePosition]);

  // Attach/detach global listeners during drag
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  // Sync currentPosition with widget.position when widget updates
  // useEffect(() => {
  //   if (!dragState.isDragging) {
  //     setCurrentPosition(widget.position);
  //   }
  // }, [widget.position, dragState.isDragging]);

  return (
    <Card
      style={{
        position: "absolute",
        left: currentPosition.x,
        top: currentPosition.y,
        cursor: isDraggable
          ? dragState.isDragging
            ? "grabbing"
            : "grab"
          : "default",
        zIndex: dragState.isDragging ? 1000 : 1,
      }}
      className={`group transition-all ${
        isEditing ? "ring-2 ring-primary ring-opacity-50" : ""
      } ${dragState.isDragging ? "opacity-80 shadow-lg" : ""}`}
      onMouseDown={handleMouseDown}
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
  );
}
