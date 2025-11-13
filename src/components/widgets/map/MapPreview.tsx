import { MapContext } from "./map-context";
import { MapTitle } from "./map-title";
import { MapDisplay } from "./map-display";
import { MapStats } from "./map-stats";
import { MapEmptyState } from "./map-empty-state";
import type { MapConfig } from "./types";
import { createPreviewMapData } from "./utils";
import { useWidget } from "../widget/WidgetProvider";

export function MapPreview() {
  const { widget } = useWidget();
  const config = widget.config as MapConfig;
  const mapData = createPreviewMapData(config);

  const contextValue = {
    mapData,
    userPin: null,
    isPlacingPin: false,
    hasPin: false,
    totalVisits: mapData?.totalVisits || 0,
    isEditing: true,
    actions: {
      placePin: () => {},
      removePin: () => {},
    },
  };

  return (
    <>
      {!mapData || !mapData.title ? (
        <MapEmptyState />
      ) : (
        <MapContext.Provider value={contextValue}>
          <div className="space-y-4 w-full overflow-hidden h-[350px] flex flex-col">
            <MapTitle />
            <MapDisplay />
            <MapStats />
          </div>
        </MapContext.Provider>
      )}
    </>
  );
}
