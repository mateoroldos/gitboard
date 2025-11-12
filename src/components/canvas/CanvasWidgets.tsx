import { useState, useEffect, useRef } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { WidgetConfigDialog } from "@/components/widgets/WidgetConfigDialog";
import type { WidgetInstance } from "@/components/widgets/types";
import { useCanvasContext } from "./CanvasContext";
import { Card, CardContent } from "../ui/card";

export function CanvasWidgets() {
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<WidgetInstance | null>(
    null,
  );

  const { boardId, viewport, fitToContent } = useCanvasContext();

  const { data: widgets } = useSuspenseQuery(
    convexQuery(api.widgets.getWidgetsByBoard, {
      boardId,
    }),
  );

  const handleEditWidget = (widget: WidgetInstance) => {
    setSelectedWidget(widget);
    setConfigDialogOpen(true);
  };

  const autoFittedRef = useRef(false);

  // Auto-fit to content when widgets first load
  useEffect(() => {
    if (
      widgets.length > 0 &&
      viewport.zoom === 1 &&
      viewport.x === 0 &&
      viewport.y === 0 &&
      !autoFittedRef.current
    ) {
      // Only auto-fit if we're at the default viewport position
      fitToContent(widgets);
      autoFittedRef.current = true;
    }
  }, [widgets.length, fitToContent, viewport.zoom, viewport.x, viewport.y]);

  if (widgets.length === 0) {
    return (
      <div
        className="flex h-80 items-center justify-center text-muted-foreground max-w-lg text-center mx-auto"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Card>
          <CardContent>
            <p>Upss... this board doesn't have any widget yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-full">
        {widgets.map((widget) => (
          <WidgetRenderer
            key={widget._id}
            widget={widget}
            onConfigChange={() => handleEditWidget(widget)}
          />
        ))}
      </div>

      {selectedWidget && (
        <WidgetConfigDialog
          widget={selectedWidget}
          open={configDialogOpen}
          onOpenChange={setConfigDialogOpen}
        />
      )}
    </>
  );
}
