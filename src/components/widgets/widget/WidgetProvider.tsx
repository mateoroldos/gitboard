import {
  createContext,
  useContext,
  ReactNode,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { useAction } from "convex/react";
import { api } from "convex/_generated/api";
import debounce from "debounce";
import { WidgetInstance } from "../types";
import { useCanvasContext } from "@/components/canvas/CanvasContext";

interface WidgetActions<TConfig> {
  deleteWidget: () => void;
  updatePosition: (position: { x: number; y: number }) => void;
  updateSize: (size: { width: number; height: number }) => void;
  updateConfig: (config: TConfig) => void;
  updateConfigDebounced: (config: TConfig) => void;
  openConfig: () => void;
}

interface WidgetState {
  isEditing: boolean;
  isPreview: boolean;
}

interface WidgetContextValue<TConfig = Record<string, any>> {
  widget: WidgetInstance<TConfig>;
  repository: string;
  actions: WidgetActions<TConfig>;
  state: WidgetState;
}

const WidgetContext = createContext<WidgetContextValue<any> | null>(null);

interface WidgetProviderProps<TConfig = Record<string, any>> {
  children: ReactNode;
  widget: WidgetInstance<TConfig>;
  isEditing?: boolean;
  isPreview?: boolean;
  isDragging?: boolean;
  onConfigChange?: () => void;
  onDelete?: () => void;
  debounceMs?: number;
}

export function WidgetProvider<TConfig = Record<string, any>>({
  children,
  widget,
  isEditing = false,
  isPreview = false,
  onConfigChange,
  onDelete,
  debounceMs = 500,
}: WidgetProviderProps<TConfig>) {
  const { repoString: repository } = useCanvasContext();

  const [optimisticWidget, setOptimisticWidget] = useState<Partial<
    Pick<WidgetInstance<TConfig>, "position" | "size" | "config">
  > | null>(null);

  const updateWidgetMutation = useMutation({
    mutationFn: useAction(api.widgets.updateWidgetAction),
    onError: () => {
      setOptimisticWidget(null);
    },
  });

  const deleteWidgetMutation = useMutation({
    mutationFn: useAction(api.widgets.deleteWidgetAction),
  });

  const debouncedUpdateWidget = useRef(
    debounce(() => {
      setOptimisticWidget((current) => {
        if (current) {
          updateWidgetMutation.mutate({
            id: widget._id,
            ...current,
          });
        }
        return current;
      });
    }, debounceMs),
  ).current;

  useEffect(() => {
    return () => {
      debouncedUpdateWidget.flush();
    };
  }, [debouncedUpdateWidget]);

  const deleteWidget = useCallback(() => {
    if (onDelete) {
      onDelete();
    } else {
      debouncedUpdateWidget.flush();
      deleteWidgetMutation.mutate({ id: widget._id });
    }
  }, [onDelete, debouncedUpdateWidget, deleteWidgetMutation, widget._id]);

  const updatePosition = useCallback(
    (position: { x: number; y: number }) => {
      setOptimisticWidget((prev) => ({ ...(prev || {}), position }));
      debouncedUpdateWidget();
    },
    [debouncedUpdateWidget],
  );

  const updateSize = useCallback(
    (size: { width: number; height: number }) => {
      setOptimisticWidget((prev) => ({ ...(prev || {}), size }));
      debouncedUpdateWidget();
    },
    [debouncedUpdateWidget],
  );

  const updateConfig = useCallback(
    (config: TConfig) => {
      updateWidgetMutation.mutate({
        id: widget._id,
        config,
      });
    },
    [updateWidgetMutation, widget._id],
  );

  const updateConfigDebounced = useCallback(
    (config: TConfig) => {
      setOptimisticWidget((prev) => ({ ...(prev || {}), config }));
      debouncedUpdateWidget();
    },
    [debouncedUpdateWidget],
  );

  const openConfig = useCallback(() => {
    if (onConfigChange) {
      onConfigChange();
    }
  }, [onConfigChange]);

  const state: WidgetState = {
    isEditing,
    isPreview,
  };

  const displayWidget = {
    ...widget,
    ...(updateWidgetMutation.variables || {}),
    ...(optimisticWidget || {}),
  };

  const contextValue: WidgetContextValue<TConfig> = {
    widget: displayWidget,
    repository,
    actions: {
      deleteWidget,
      updatePosition,
      updateSize,
      updateConfig,
      updateConfigDebounced,
      openConfig,
    },
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
