import { createContext, useContext, ReactNode, useState, useCallback } from "react";
import type { WidgetInstance } from "../types";
import type { TextData, TextConfig } from "./types";
import { createTextDataFromConfig } from "./utils";

export interface TextContextValue {
  textData: TextData | null;
  isEditing: boolean;
  updateOptimisticContent: (content: string) => void;
  resetOptimisticContent: () => void;
}

export const TextContext = createContext<TextContextValue | null>(null);

interface TextProviderProps {
  children: ReactNode;
  widget: WidgetInstance<TextConfig>;
  isEditing?: boolean;
}

export function TextProvider({
  children,
  widget,
  isEditing = false,
}: TextProviderProps) {
  const [optimisticContent, setOptimisticContent] = useState<string | null>(null);
  
  const baseTextData = createTextDataFromConfig(widget.config);
  
  // Use optimistic content if available, otherwise use the actual config
  const textData = optimisticContent !== null 
    ? { ...baseTextData, content: optimisticContent }
    : baseTextData;

  const updateOptimisticContent = useCallback((content: string) => {
    setOptimisticContent(content);
  }, []);

  const resetOptimisticContent = useCallback(() => {
    setOptimisticContent(null);
  }, []);

  // Reset optimistic state when widget config changes (successful update)
  const currentContent = widget.config.content || "";
  if (optimisticContent !== null && optimisticContent === currentContent) {
    setOptimisticContent(null);
  }

  const contextValue: TextContextValue = {
    textData,
    isEditing,
    updateOptimisticContent,
    resetOptimisticContent,
  };

  return (
    <TextContext.Provider value={contextValue}>
      {children}
    </TextContext.Provider>
  );
}

export function useText() {
  const context = useContext(TextContext);
  if (!context) {
    throw new Error("useText must be used within a TextProvider");
  }
  return context;
}