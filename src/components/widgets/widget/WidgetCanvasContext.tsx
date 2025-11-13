import React, { createContext, useContext, useReducer } from "react";

export interface WidgetCanvasState {
  isDragging: boolean;
  isResizing: boolean;
  isSelected: boolean;
}

export type WidgetCanvasAction =
  | { type: "SET_DRAGGING"; payload: boolean }
  | { type: "SET_RESIZING"; payload: boolean }
  | { type: "SET_SELECTED"; payload: boolean }
  | { type: "RESET" };

interface WidgetCanvasContextValue {
  state: WidgetCanvasState;
  setIsDragging: (isDragging: boolean) => void;
  setIsResizing: (isResizing: boolean) => void;
  setIsSelected: (isSelected: boolean) => void;
  reset: () => void;
}

const initialState: WidgetCanvasState = {
  isDragging: false,
  isResizing: false,
  isSelected: false,
};

function widgetCanvasReducer(
  state: WidgetCanvasState,
  action: WidgetCanvasAction,
): WidgetCanvasState {
  switch (action.type) {
    case "SET_DRAGGING":
      return { ...state, isDragging: action.payload };
    case "SET_RESIZING":
      return { ...state, isResizing: action.payload };
    case "SET_SELECTED":
      return { ...state, isSelected: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const WidgetCanvasContext = createContext<WidgetCanvasContextValue | null>(
  null,
);

export function useWidgetCanvasContext() {
  const context = useContext(WidgetCanvasContext);
  if (!context) {
    throw new Error(
      "useWidgetCanvasContext must be used within a WidgetCanvasProvider",
    );
  }
  return context;
}

interface WidgetCanvasProviderProps {
  children: React.ReactNode;
}

export function WidgetCanvasProvider({ children }: WidgetCanvasProviderProps) {
  const [state, dispatch] = useReducer(widgetCanvasReducer, initialState);

  const setIsDragging = (isDragging: boolean) => {
    dispatch({ type: "SET_DRAGGING", payload: isDragging });
  };

  const setIsResizing = (isResizing: boolean) => {
    dispatch({ type: "SET_RESIZING", payload: isResizing });
  };

  const setIsSelected = (isSelected: boolean) => {
    dispatch({ type: "SET_SELECTED", payload: isSelected });
  };

  const reset = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <WidgetCanvasContext.Provider
      value={{
        state,
        setIsDragging,
        setIsResizing,
        setIsSelected,
        reset,
      }}
    >
      {children}
    </WidgetCanvasContext.Provider>
  );
}

