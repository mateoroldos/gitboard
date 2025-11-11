import { ReactNode } from "react";
import { TextProvider } from "./text-context";
import { useWidget } from "../WidgetProvider";
import type { TextConfig } from "./types";

interface TextRootProps {
  children: ReactNode;
  className?: string;
}

export function TextRoot({ children, className }: TextRootProps) {
  const { widget, state } = useWidget<TextConfig>();

  return (
    <div className={`overflow-hidden w-full h-full ${className}`}>
      <TextProvider widget={widget} isEditing={state.isEditing}>
        {children}
      </TextProvider>
    </div>
  );
}