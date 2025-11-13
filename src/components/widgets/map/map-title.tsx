import { useMap } from "./map-context";

export function MapTitle() {
  const { mapData } = useMap();

  if (!mapData?.title) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-foreground">
        {mapData.title}
      </h3>
    </div>
  );
}