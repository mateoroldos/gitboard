import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";

export const Route = createFileRoute("/$owner/$name")({
  component: RepoBoard,
});

function RepoBoard() {
  const { owner, name } = Route.useParams();
  const repoString = `${owner}/${name}`;
  const [isCreating, setIsCreating] = useState(false);

  const { data: board } = useSuspenseQuery(
    convexQuery(api.boards.getBoardByRepo, { repo: repoString }),
  );
  const { data: widgets } = useSuspenseQuery(
    convexQuery(api.widgets.getWidgetsByBoard, {
      boardId: board?._id!,
    }),
  );
  const createWidget = useAction(api.widgets.createWidgetAction);

  const handleCreateWidget = async () => {
    if (!board) return;

    setIsCreating(true);
    try {
      await createWidget({
        boardId: board._id,
        widgetType: "text-note",
        config: { text: "New widget" },
        position: { x: 100, y: 100 },
        size: { width: 200, height: 150 },
        title: "New Widget",
      });
    } finally {
      setIsCreating(false);
    }
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
          <button
            onClick={handleCreateWidget}
            disabled={isCreating}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50"
          >
            {isCreating ? "Creating..." : "Add Widget"}
          </button>
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
                  <div
                    key={widget._id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4"
                  >
                    <h3 className="font-medium text-gray-900 mb-2">
                      {widget.title || widget.widgetType}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Type: {widget.widgetType}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {new Date(widget.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
