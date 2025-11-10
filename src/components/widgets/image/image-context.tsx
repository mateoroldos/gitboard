import { createContext, useContext, ReactNode } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import type { WidgetInstance } from "../types";
import type { ImageData, ImageConfig } from "./types";
import { createPreviewImageData } from "./utils";

export interface ImageContextValue {
  imageData: ImageData | null;
  isEditing: boolean;
}

export const ImageContext = createContext<ImageContextValue | null>(null);

interface ImageProviderProps {
  children: ReactNode;
  widget: WidgetInstance<ImageConfig>;
  isEditing?: boolean;
}

export function ImageProvider({
  children,
  widget,
  isEditing = false,
}: ImageProviderProps) {
  // Always fetch real data if there's an imageKey, even in editing mode
  const hasImageKey = widget.config.imageKey && widget.config.imageKey.length > 0;
  
  const { data: imageData } = useSuspenseQuery({
    ...convexQuery(api.image.getImageData, { widgetId: widget._id }),
    enabled: !isEditing || hasImageKey,
  });

  const previewData = isEditing && !hasImageKey ? createPreviewImageData(widget.config) : null;

  const contextValue: ImageContextValue = {
    imageData: isEditing && !hasImageKey ? previewData : imageData,
    isEditing,
  };

  return (
    <ImageContext.Provider value={contextValue}>
      {children}
    </ImageContext.Provider>
  );
}

export function useImage() {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImage must be used within an ImageProvider");
  }
  return context;
}