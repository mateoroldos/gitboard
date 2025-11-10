import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  RefObject,
} from "react";
import type { Id } from "convex/_generated/dataModel";
import { useCanvasInteractions } from "./useCanvasInteractions";

interface Viewport {
  x: number;
  y: number;
  zoom: number;
  width: number;
  height: number;
}

interface CanvasContextType {
  boardId: Id<"boards">;
  repoString: string;
  hasWriteAccess: boolean;
  canvasRef: RefObject<HTMLDivElement>;
  viewport: Viewport;
  panTo: (x: number, y: number) => void;
  zoomTo: (zoom: number, centerX?: number, centerY?: number) => void;
  panBy: (deltaX: number, deltaY: number) => void;
  zoomBy: (delta: number, centerX?: number, centerY?: number) => void;
  fitToContent: (
    widgets: Array<{
      position: { x: number; y: number };
      size: { width: number; height: number };
    }>,
  ) => void;
  worldToScreen: (worldPos: { x: number; y: number }) => {
    x: number;
    y: number;
  };
  screenToWorld: (screenPos: { x: number; y: number }) => {
    x: number;
    y: number;
  };
  setViewportSize: (width: number, height: number) => void;
}

const CanvasContext = createContext<CanvasContextType | null>(null);

interface CanvasProviderProps {
  children: React.ReactNode;
  boardId: Id<"boards">;
  repoString: string;
  hasWriteAccess: boolean;
}

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3.0;
const DEFAULT_ZOOM = 1.0;

export function CanvasProvider({
  children,
  boardId,
  repoString,
  hasWriteAccess,
}: CanvasProviderProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<Viewport>({
    x: 0,
    y: 0,
    zoom: DEFAULT_ZOOM,
    width: 0,
    height: 0,
  });

  const panTo = useCallback((x: number, y: number) => {
    setViewport((prev) => ({ ...prev, x, y }));
  }, []);

  const panBy = useCallback((deltaX: number, deltaY: number) => {
    setViewport((prev) => ({
      ...prev,
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));
  }, []);

  const zoomTo = useCallback(
    (zoom: number, centerX?: number, centerY?: number) => {
      const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));

      setViewport((prev) => {
        if (centerX !== undefined && centerY !== undefined) {
          // Zoom towards a specific point
          const zoomRatio = clampedZoom / prev.zoom;
          const newX = centerX - (centerX - prev.x) * zoomRatio;
          const newY = centerY - (centerY - prev.y) * zoomRatio;

          return {
            ...prev,
            x: newX,
            y: newY,
            zoom: clampedZoom,
          };
        }

        return { ...prev, zoom: clampedZoom };
      });
    },
    [],
  );

  const zoomBy = useCallback(
    (delta: number, centerX?: number, centerY?: number) => {
      setViewport((prev) => {
        const newZoom = Math.max(
          MIN_ZOOM,
          Math.min(MAX_ZOOM, prev.zoom * (1 + delta)),
        );

        if (centerX !== undefined && centerY !== undefined) {
          const zoomRatio = newZoom / prev.zoom;
          const newX = centerX - (centerX - prev.x) * zoomRatio;
          const newY = centerY - (centerY - prev.y) * zoomRatio;

          return {
            ...prev,
            x: newX,
            y: newY,
            zoom: newZoom,
          };
        }

        return { ...prev, zoom: newZoom };
      });
    },
    [],
  );

  const fitToContent = useCallback(
    (
      widgets: Array<{
        position: { x: number; y: number };
        size: { width: number; height: number };
      }>,
    ) => {
      if (widgets.length === 0) return;

      const padding = 100;
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      widgets.forEach((widget) => {
        minX = Math.min(minX, widget.position.x);
        minY = Math.min(minY, widget.position.y);
        maxX = Math.max(maxX, widget.position.x + widget.size.width);
        maxY = Math.max(maxY, widget.position.y + widget.size.height);
      });

      const contentWidth = maxX - minX + padding * 2;
      const contentHeight = maxY - minY + padding * 2;

      const scaleX = viewport.width / contentWidth;
      const scaleY = viewport.height / contentHeight;
      const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      setViewport((prev) => ({
        ...prev,
        zoom: scale,
        x: prev.width / 2 / scale - centerX,
        y: prev.height / 2 / scale - centerY,
      }));
    },
    [viewport.width, viewport.height],
  );

  const worldToScreen = useCallback(
    (worldPos: { x: number; y: number }) => ({
      x: (worldPos.x + viewport.x) * viewport.zoom,
      y: (worldPos.y + viewport.y) * viewport.zoom,
    }),
    [viewport.x, viewport.y, viewport.zoom],
  );

  const screenToWorld = useCallback(
    (screenPos: { x: number; y: number }) => ({
      x: screenPos.x / viewport.zoom - viewport.x,
      y: screenPos.y / viewport.zoom - viewport.y,
    }),
    [viewport.x, viewport.y, viewport.zoom],
  );

  const setViewportSize = useCallback((width: number, height: number) => {
    setViewport((prev) => ({ ...prev, width, height }));
  }, []);

  const contextValue = useMemo(
    () => ({
      boardId,
      repoString,
      hasWriteAccess,
      canvasRef,
      viewport,
      panTo,
      zoomTo,
      panBy,
      zoomBy,
      fitToContent,
      worldToScreen,
      screenToWorld,
      setViewportSize,
    }),
    [
      boardId,
      repoString,
      hasWriteAccess,
      canvasRef,
      viewport,
      panTo,
      zoomTo,
      panBy,
      zoomBy,
      fitToContent,
      worldToScreen,
      screenToWorld,
      setViewportSize,
    ],
  );

  useCanvasInteractions({
    containerRef: canvasRef,
    panBy,
    zoomBy,
    setViewportSize,
  });

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvasContext() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvasContext must be used within a CanvasProvider");
  }
  return context;
}
