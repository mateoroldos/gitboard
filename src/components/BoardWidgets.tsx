import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { WidgetConfigDialog } from "@/components/widgets/WidgetConfigDialog";
import type { WidgetInstance } from "@/components/widgets/types";
import { useCanvasContext } from "./CanvasContext";

export function BoardWidgets() {
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<WidgetInstance | null>(
    null,
  );

  const { boardId, repoString } = useCanvasContext();

  const { data: widgets } = useSuspenseQuery(
    convexQuery(api.widgets.getWidgetsByBoard, {
      boardId,
    }),
  );

  const handleEditWidget = (widget: WidgetInstance) => {
    setSelectedWidget(widget);
    setConfigDialogOpen(true);
  };

  if (widgets.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center text-muted-foreground max-w-lg text-center mx-auto">
        <p>Upss... this board doesn't have any widget yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        {widgets.map((widget) => (
          <WidgetRenderer
            key={widget._id}
            widget={widget}
            repository={repoString}
            onConfigChange={() => handleEditWidget(widget)}
          />
        ))}
      </div>

      {selectedWidget && (
        <WidgetConfigDialog
          widget={selectedWidget}
          repository={repoString}
          open={configDialogOpen}
          onOpenChange={setConfigDialogOpen}
        />
      )}
    </>
  );
}
