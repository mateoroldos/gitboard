import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAction } from "convex/react";
import { api } from "convex/_generated/api";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { convexAction, convexQuery } from "@convex-dev/react-query";
import { WidgetSelector } from "@/components/widgets/WidgetSelector";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { WidgetConfigDialog } from "@/components/widgets/WidgetConfigDialog";
import { getWidgetById } from "@/components/widgets/registry";
import type { WidgetDefinition } from "@/components/widgets/types";


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
  const [selectedWidget, setSelectedWidget] = useState<any>(null);

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

  const { mutate: updateWidget } = useMutation({
    mutationFn: useAction(api.widgets.updateWidgetAction),
  });

  const { mutate: deleteWidget } = useMutation({
    mutationFn: useAction(api.widgets.deleteWidgetAction),
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

  const handleEditWidget = (widget: any) => {
    setSelectedWidget(widget);
    setConfigDialogOpen(true);
  };

  const handleDeleteWidget = (widget: any) => {
    if (confirm("Are you sure you want to delete this widget?")) {
      deleteWidget({ id: widget._id });
    }
  };

  const handleSaveConfig = async (config: Record<string, any>) => {
    if (!selectedWidget) return;
    
    updateWidget({
      id: selectedWidget._id,
      config,
    });
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{repoString}</h1>
            <p className="text-gray-600 mt-1">GitHub Repository Board</p>
          </div>
          {hasAccess && (
            <WidgetSelector 
              onSelectWidget={handleSelectWidget} 
              disabled={isPending}
            />
          )}
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Project Board</h2>
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
                      onDelete={() => handleDeleteWidget(widget)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Configuration Dialog */}
      {selectedWidget && (
        <WidgetConfigDialog
          widget={selectedWidget}
          widgetDefinition={getWidgetById(selectedWidget.widgetType)!}
          repository={repoString}
          open={configDialogOpen}
          onOpenChange={setConfigDialogOpen}
          onSave={handleSaveConfig}
        />
      )}
    </div>
  );
}
