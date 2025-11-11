import { createContext, useContext, ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAction } from "convex/react";
import { api } from "convex/_generated/api";
import { WidgetInstance } from "./types";
import { useCanvasContext } from "../canvas/CanvasContext";

interface WidgetActions {
  updateWidget: (updates: Partial<WidgetInstance>) => void;
  deleteWidget: () => void;
  updatePosition: (position: { x: number; y: number }) => void;
  updateSize: (size: { width: number; height: number }) => void;
  updateConfig: (config: Record<string, any>) => void;
  openConfig: () => void;
}

interface WidgetState {
  isEditing: boolean;
  isPreview: boolean;
  isDragging: boolean;
  hasWriteAccess: boolean;
}

interface WidgetContextValue<TConfig = Record<string, any>> {
  widget: WidgetInstance<TConfig>;
  repository: string;
  actions: WidgetActions;
  state: WidgetState;
}

const WidgetContext = createContext<WidgetContextValue | null>(null);

interface WidgetProviderProps<TConfig = Record<string, any>> {
  children: ReactNode;
  widget: WidgetInstance<TConfig>;
  isEditing?: boolean;
  isPreview?: boolean;
  isDragging?: boolean;
  onConfigChange?: () => void;
  onDelete?: () => void;
}

export function WidgetProvider<TConfig = Record<string, any>>({
  children,
  widget,
  isEditing = false,
  isPreview = false,
  isDragging = false,
  onConfigChange,
  onDelete,
}: WidgetProviderProps<TConfig>) {
  const { hasWriteAccess, repoString: repository } = useCanvasContext();

  const { mutate: updateWidgetMutation } = useMutation({
    mutationFn: useAction(api.widgets.updateWidgetAction),
  });

  const { mutate: deleteWidgetMutation } = useMutation({
    mutationFn: useAction(api.widgets.deleteWidgetAction),
  });

  const actions: WidgetActions = {
    updateWidget: (updates) => {
      updateWidgetMutation({
        id: widget._id,
        ...updates,
      });
    },
    deleteWidget: () => {
      if (onDelete) {
        onDelete();
      } else if (confirm("Are you sure you want to delete this widget?")) {
        deleteWidgetMutation({ id: widget._id });
      }
    },
    updatePosition: (position) => {
      updateWidgetMutation({
        id: widget._id,
        position,
      });
    },
    updateSize: (size) => {
      updateWidgetMutation({
        id: widget._id,
        size,
      });
    },
    updateConfig: (config) => {
      updateWidgetMutation({
        id: widget._id,
        config,
      });
    },
    openConfig: () => {
      if (onConfigChange) {
        onConfigChange();
      }
    },
  };

  const state: WidgetState = {
    isEditing,
    isPreview,
    isDragging,
    hasWriteAccess,
  };

  const contextValue: WidgetContextValue<TConfig> = {
    widget,
    repository,
    actions,
    state,
  };

  return (
    <WidgetContext.Provider value={contextValue}>
      {children}
    </WidgetContext.Provider>
  );
}

export function useWidget<
  TConfig = Record<string, any>,
>(): WidgetContextValue<TConfig> {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }

  return context;
}
