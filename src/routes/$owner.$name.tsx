import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAction } from "convex/react";
import { api } from "convex/_generated/api";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { convexAction, convexQuery } from "@convex-dev/react-query";
import { WidgetSelector } from "@/components/widgets/WidgetSelector";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { WidgetConfigDialog } from "@/components/widgets/WidgetConfigDialog";
import type {
  WidgetDefinition,
  WidgetInstance,
} from "@/components/widgets/types";
import { Card, CardContent } from "@/components/ui/card";
import { GitBranch, Github } from "lucide-react";

export const Route = createFileRoute("/$owner/$name")({
  loader: async (opts) => {
    const { owner, name } = opts.params;

    await opts.context.queryClient.ensureQueryData(
      convexAction(api.auth.checkRepoWriteAccess, { repo: `${owner}/${name}` }),
    );
  },
  component: RepoBoard,
});

function RepoBoard() {
  const { owner, name } = Route.useParams();
  const repoString = `${owner}/${name}`;

  // Configuration dialog state
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<WidgetInstance | null>(
    null,
  );

  const { data: hasAccess } = useSuspenseQuery(
    convexAction(api.auth.checkRepoWriteAccess, { repo: repoString }),
  );
  const { data: board } = useSuspenseQuery(
    convexQuery(api.boards.getBoardByRepo, { repo: repoString }),
  );
  const { data: widgets } = useSuspenseQuery(
    convexQuery(api.widgets.getWidgetsByBoard, {
      boardId: board?._id!,
    }),
  );

  const { mutate: createWidget, isPending } = useMutation({
    mutationFn: useAction(api.widgets.createWidgetAction),
  });

  const handleSelectWidget = async (widgetDef: WidgetDefinition) => {
    if (!board) return;

    // Use widget definition to create widget with proper defaults
    createWidget({
      boardId: board._id,
      widgetType: widgetDef.id,
      config: { ...widgetDef.defaultConfig, repository: repoString },
      position: { x: 100, y: 100 },
      size: widgetDef.size.default,
      title: widgetDef.name,
    });
  };

  const handleEditWidget = (widget: WidgetInstance) => {
    setSelectedWidget(widget);
    setConfigDialogOpen(true);
  };

  if (!board) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Board not found
          </h1>
          <p className="text-gray-600">No board exists for {repoString}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="py-3 flex flex-row justify-between container mx-auto">
        <a href={`https://github.com/${repoString}`} target="_blank">
          <Card className="py-2 group hover:border-primary/40 transition-all">
            <CardContent className="flex flex-row items-center gap-2 text-sm px-3">
              <Github className="size-4 text-muted-foreground/70 group-hover:text-primary transition-all" />
              <h1 className="font-semibold">{repoString}</h1>
            </CardContent>
          </Card>
        </a>
        {hasAccess && (
          <WidgetSelector
            onSelectWidget={handleSelectWidget}
            disabled={isPending}
          />
        )}
      </nav>

      <main className="container mx-auto">
        {widgets.length === 0 ? (
          <p className="text-gray-600">
            No widgets yet. Click "Add Widget" to get started!
          </p>
        ) : (
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
        )}
      </main>

      {/* Configuration Dialog */}
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
