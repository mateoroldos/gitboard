import { MapRoot } from "./map-root";
import { MapTitle } from "./map-title";
import { MapDisplay } from "./map-display";
import { MapStats } from "./map-stats";
import { MapEmptyState } from "./map-empty-state";
import { useMap } from "./map-context";

function MapContent() {
  const { mapData } = useMap();

  if (!mapData || !mapData.title) {
    return <MapEmptyState />;
  }

  return (
    <div className="space-y-4 w-full overflow-hidden flex flex-col">
      <MapTitle />
      <MapDisplay />
      <MapStats />
    </div>
  );
}

export function MapWidget() {
  return (
    <MapRoot>
      <MapContent />
    </MapRoot>
  );
}