import React, { createContext, useContext } from "react";
import type { Id } from "convex/_generated/dataModel";

interface CanvasContextType {
  boardId: Id<"boards">;
  repoString: string;
  hasWriteAccess: boolean;
  canvasOffset: { x: number; y: number };
  zoom: number;
}

const CanvasContext = createContext<CanvasContextType | null>(null);

interface CanvasProviderProps {
  children: React.ReactNode;
  boardId: Id<"boards">;
  repoString: string;
  hasWriteAccess: boolean;
  canvasOffset?: { x: number; y: number };
  zoom?: number;
}

export function CanvasProvider({
  children,
  boardId,
  repoString,
  hasWriteAccess,
  zoom = 1,
}: CanvasProviderProps) {
  return (
    <CanvasContext.Provider
      value={{
        boardId,
        repoString,
        hasWriteAccess,
        zoom,
      }}
    >
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

