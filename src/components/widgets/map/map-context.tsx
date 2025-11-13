import { createContext, useContext, ReactNode } from "react";
import {
  useSuspenseQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import type { WidgetInstance } from "../types";
import type { MapData, UserPin, MapConfig } from "./types";
import { useAction } from "convex/react";

export interface MapContextValue {
  mapData: MapData | null;
  userPin: UserPin | null;
  isPlacingPin: boolean;
  hasPin: boolean;
  totalVisits: number;
  isEditing: boolean;
  actions: {
    placePin: (latitude: number, longitude: number) => void;
    removePin: () => void;
  };
}

export const MapContext = createContext<MapContextValue | null>(null);

interface MapProviderProps {
  children: ReactNode;
  widget: WidgetInstance<MapConfig>;
  isEditing?: boolean;
}

export function MapProvider({
  children,
  widget,
  isEditing = false,
}: MapProviderProps) {
  const { data: mapData } = useSuspenseQuery(
    convexQuery(api.maps.getMapData, { widgetId: widget._id }),
  );

  const { data: userPin } = useQuery({
    ...convexQuery(api.maps.checkUserPin, { widgetId: widget._id }),
    enabled: !!mapData && !isEditing,
  });

  const placePinMutation = useMutation({
    mutationFn: useAction(api.maps.placePin),
  });

  const removePinMutation = useMutation({
    mutationFn: useAction(api.maps.deletePinAction),
  });

  const hasPin = !!userPin && !isEditing;
  const totalVisits = mapData?.totalVisits ?? 0;

  const actions = {
    placePin: (latitude: number, longitude: number) => {
      if (!isEditing) {
        placePinMutation.mutate({
          widgetId: widget._id,
          latitude,
          longitude,
        });
      }
    },
    removePin: () => {
      if (!isEditing && hasPin) {
        removePinMutation.mutate({
          widgetId: widget._id,
        });
      }
    },
  };

  const contextValue: MapContextValue = {
    mapData,
    userPin: userPin as UserPin | null,
    isPlacingPin: placePinMutation.isPending,
    hasPin,
    totalVisits,
    isEditing,
    actions,
  };

  return (
    <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
}

export function useMapActions() {
  const { actions } = useMap();
  return actions;
}

export function useMapAuth() {
  const { hasPin, isEditing } = useMap();
  return {
    hasPin,
    isEditing,
    canPlacePin: !isEditing,
  };
}