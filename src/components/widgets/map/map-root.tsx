import { ReactNode } from "react";
import { MapProvider } from "./map-context";
import { useWidget } from "../WidgetProvider";
import type { MapConfig } from "./types";

interface MapRootProps {
  children: ReactNode;
  className?: string;
}

export function MapRoot({ children }: MapRootProps) {
  const { widget, state } = useWidget<MapConfig>();

  return (
    <MapProvider widget={widget} isEditing={state.isEditing}>
      {children}
    </MapProvider>
  );
}