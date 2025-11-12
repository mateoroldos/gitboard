import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Keyboard,
  Mouse,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
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
    <div className="fixed bottom-5 right-5 z-20 flex flex-col gap-2">
      <div className="flex flex-row gap-1 justify-end">
        <div className="bg-background/80 rounded flex flex-row divide-x backdrop-blur-sm border shadow-lg">
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
                className="h-8 w-8 p-0"
                title="Fit to content"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="bg-background/80 rounded backdrop-blur-sm border shadow-lg">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Keyboard shortcuts"
              >
                <Keyboard className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-3 rounded"
              align="end"
              side="top"
              sideOffset={8}
            >
              <div className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mouse className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">Space + drag</span>
                    </div>
                    <span className="text-muted-foreground text-xs">Pan</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mouse className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">Scroll</span>
                    </div>
                    <span className="text-muted-foreground text-xs">Pan</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <KbdGroup>
                        <Kbd>Ctrl</Kbd>
                        <span className="text-xs">+</span>
                        <span className="text-xs">scroll</span>
                      </KbdGroup>
                    </div>
                    <span className="text-muted-foreground text-xs">Zoom</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-3 w-3 text-muted-foreground" />
                      <KbdGroup>
                        <Kbd>↑</Kbd>
                        <Kbd>↓</Kbd>
                        <Kbd>←</Kbd>
                        <Kbd>→</Kbd>
                      </KbdGroup>
                      <span className="text-xs">or</span>
                      <KbdGroup>
                        <Kbd>h</Kbd>
                        <Kbd>j</Kbd>
                        <Kbd>k</Kbd>
                        <Kbd>l</Kbd>
                      </KbdGroup>
                    </div>
                    <span className="text-muted-foreground text-xs">Pan</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Keyboard className="h-3 w-3 text-muted-foreground" />
                      <KbdGroup>
                        <Kbd>Ctrl</Kbd>
                        <Kbd>+</Kbd>
                      </KbdGroup>
                      <span className="text-xs">/</span>
                      <KbdGroup>
                        <Kbd>Ctrl</Kbd>
                        <Kbd>-</Kbd>
                      </KbdGroup>
                    </div>
                    <span className="text-muted-foreground text-xs">Zoom</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
