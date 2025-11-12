import { Suspense } from "react";
import { useCanvasContext } from "./CanvasContext";
import { CanvasWidgets } from "./CanvasWidgets";

export function CanvasContainer() {
  const { canvasRef, viewport, setSelectedWidgetId } = useCanvasContext();

  return (
    <div
      ref={canvasRef}
      className="h-screen w-screen absolute top-0 left-0 overflow-hidden"
      onClick={() => setSelectedWidgetId(null)}
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, oklch(from var(--muted-foreground) l c h / 0.25) 1px, transparent 0)`,
        backgroundSize: `${20 * viewport.zoom}px ${20 * viewport.zoom}px`,
        backgroundPosition: `${viewport.x * viewport.zoom}px ${viewport.y * viewport.zoom}px`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Suspense>
          <CanvasWidgets />
        </Suspense>
      </div>
    </div>
  );
}
