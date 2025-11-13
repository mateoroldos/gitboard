import { MapPin } from "lucide-react";

export function MapEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
      <MapPin className="h-12 w-12 mb-4 opacity-50" />
      <h3 className="text-lg font-medium mb-2">No Map Configured</h3>
      <p className="text-sm">
        Configure your map widget to start collecting visitor pins
      </p>
    </div>
  );
}