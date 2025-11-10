import { ReactNode } from "react";
import { ImageProvider } from "./image-context";
import { useWidget } from "../WidgetProvider";
import type { ImageConfig } from "./types";

interface ImageRootProps {
  children: ReactNode;
  className?: string;
}

export function ImageRoot({ children, className }: ImageRootProps) {
  const { widget, state } = useWidget<ImageConfig>();

  return (
    <div className={className}>
      <ImageProvider widget={widget} isEditing={state.isEditing}>
        {children}
      </ImageProvider>
    </div>
  );
}