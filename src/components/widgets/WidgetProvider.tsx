import { createContext, useContext, ReactNode, useState, useEffect, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAction } from "convex/react";
import { api } from "convex/_generated/api";
import { WidgetInstance } from "./types";
import { useCanvasContext } from "../canvas/CanvasContext";
import { toast } from "sonner";
import debounce from "debounce";

interface WidgetActions {
  updateWidget: (updates: Partial<WidgetInstance>) => void;
  deleteWidget: () => void;
  updatePosition: (position: { x: number; y: number }) => void;
  updateSize: (size: { width: number; height: number }) => void;
  updateConfig: (config: Record<string, any>) => void;
  updateConfigOptimistic: (config: Record<string, any>) => void;
  updateConfigOptimisticDebounced: (config: Record<string, any>) => void;
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

  // Local state for optimistic updates
  const [optimisticWidget, setOptimisticWidget] = useState<WidgetInstance<TConfig>>(widget);
  const pendingConfigRef = useRef<Record<string, any> | null>(null);

  // Smart sync optimistic state when widget prop changes (from server updates)
  useEffect(() => {
    // Only sync if no pending optimistic updates or if server data matches pending state
    if (!pendingConfigRef.current) {
      setOptimisticWidget(widget);
    } else {
      // Check if server data matches our pending optimistic state
      const serverConfig = widget.config;
      const pendingConfig = pendingConfigRef.current;
      
      // Deep compare configs to see if they match
      const configsMatch = JSON.stringify(serverConfig) === JSON.stringify(pendingConfig);
      
      if (configsMatch) {
        // Server confirmed our optimistic update
        setOptimisticWidget(widget);
        pendingConfigRef.current = null;
      } else {
        // Server has different data, but we have pending changes
        // Keep optimistic state but update other properties
        setOptimisticWidget(prev => ({
          ...widget,
          config: prev.config // Keep optimistic config
        }));
      }
    }
  }, [widget]);

  const { mutate: updateWidgetMutation } = useMutation({
    mutationFn: useAction(api.widgets.updateWidgetAction),
    onError: (error) => {
      // Revert optimistic update on error
      setOptimisticWidget(widget);
      
      // Show error toast
      toast.error("Failed to update widget", {
        description: "Your changes couldn't be saved. Please try again.",
      });
      
      console.error("Widget update failed:", error);
    },
  });

  const { mutate: deleteWidgetMutation } = useMutation({
    mutationFn: useAction(api.widgets.deleteWidgetAction),
  });

  // Debounced server update for rapid changes
  const debouncedServerUpdate = useCallback(
    debounce((config: Record<string, any>) => {
      updateWidgetMutation({
        id: widget._id,
        config,
      });
      pendingConfigRef.current = null;
    }, 300),
    [updateWidgetMutation, widget._id]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedServerUpdate.clear?.();
    };
  }, [debouncedServerUpdate]);

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
    updateConfigOptimistic: (config) => {
      // Immediate optimistic update
      setOptimisticWidget(prev => ({ ...prev, config }));
      
      // Background server update
      updateWidgetMutation({
        id: widget._id,
        config,
      });
    },
    updateConfigOptimisticDebounced: (config) => {
      // Immediate optimistic update
      setOptimisticWidget(prev => ({ ...prev, config }));
      
      // Store pending config for potential revert
      pendingConfigRef.current = config;
      
      // Debounced server update
      debouncedServerUpdate(config);
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
    widget: optimisticWidget,
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
