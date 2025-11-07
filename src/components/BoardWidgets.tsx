import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { WidgetConfigDialog } from "@/components/widgets/WidgetConfigDialog";
import type { WidgetInstance } from "@/components/widgets/types";
import type { Id } from "convex/_generated/dataModel";

interface BoardWidgetsProps {
  boardId: Id<"boards">;
  repoString: string;
}

export function BoardWidgets({ boardId, repoString }: BoardWidgetsProps) {
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<WidgetInstance | null>(
    null,
  );

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget) => (
          <div key={widget._id} className="group">
            <WidgetRenderer
              widgetType={widget.widgetType}
              config={widget.config}
              instanceId={widget._id}
              repository={repoString}
              onConfigChange={() => handleEditWidget(widget)}
            />
          </div>
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

