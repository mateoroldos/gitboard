import { useMap } from "./map-context";
import { Pin } from "lucide-react";

export function MapStats() {
  const { mapData } = useMap();

  if (!mapData?.showStats) {
    return null;
  }

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-3">
      <div className="flex items-center gap-2">
        <Pin className="size-3" />
        <span className="text-xs">
          {mapData.pins.length} {mapData.pins.length === 1 ? "pin" : "pins"}
        </span>
      </div>
    </div>
  );
}

