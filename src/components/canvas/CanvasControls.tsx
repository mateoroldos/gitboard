import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCanvasContext } from "./CanvasContext";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";

export function CanvasControls() {
  const { viewport, zoomBy, zoomTo, fitToContent, boardId } =
    useCanvasContext();

  const { data: widgets } = useSuspenseQuery(
    convexQuery(api.widgets.getWidgetsByBoard, {
      boardId,
    }),
  );

  const handleZoomIn = () => {
    zoomBy(0.2, viewport.width / 2, viewport.height / 2);
  };

  const handleZoomOut = () => {
    zoomBy(-0.2, viewport.width / 2, viewport.height / 2);
  };

  const handleResetZoom = () => {
    zoomTo(1, viewport.width / 2, viewport.height / 2);
  };

  const handleFitToContent = () => {
    if (widgets.length > 0) {
      fitToContent(widgets);
    }
  };

  const zoomPercentage = Math.round(viewport.zoom * 100);

  return (
    <div className="fixed bottom-4 right-4 z-20 flex flex-col gap-2">
      <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-2 shadow-lg text-xs text-muted-foreground">
        <div className="space-y-1">
          <div>🖱️ Space + drag to pan</div>
          <div>⚙️ Scroll to pan</div>
          <div>⚙️ Ctrl + scroll to zoom</div>
          <div>⌨️ Arrow keys to pan</div>
          <div>⌨️ Ctrl +/- to zoom</div>
        </div>
      </div>

      <div className="bg-background/80 flex flex-row divide-x backdrop-blur-sm border rounded-lg shadow-lg">
        <div className="flex flex-row gap-1 flex-1 justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={viewport.zoom <= 0.1}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetZoom}
            className="h-8 px-2 text-xs font-mono"
          >
            {zoomPercentage}%
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={viewport.zoom >= 3}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {widgets.length > 0 && (
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFitToContent}
              className="p-0"
              title="Fit to content"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

