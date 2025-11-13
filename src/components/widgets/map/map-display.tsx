import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { Pin } from "lucide-react";
import { useMap } from "./map-context";
import { MapAuthGate } from "./map-auth-gate";
import { authClient } from "@/lib/auth-client";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export function MapDisplay() {
  const { mapData, userPin, hasPin, actions, isEditing } = useMap();
  const { data: session } = authClient.useSession();

  if (!mapData) {
    return null;
  }

  let mouseDownTime = 0;
  let mouseDownPosition = { x: 0, y: 0 };

  const handleMouseDown = (evt: any) => {
    mouseDownTime = Date.now();
    mouseDownPosition = { x: evt.clientX, y: evt.clientY };
  };

  const handleClick = (projection: any) => (evt: any) => {
    if (isEditing) return;

    // Don't allow pin placement if user is not authenticated
    if (!session) return;

    const clickDuration = Date.now() - mouseDownTime;
    const mouseMovement = Math.sqrt(
      Math.pow(evt.clientX - mouseDownPosition.x, 2) +
        Math.pow(evt.clientY - mouseDownPosition.y, 2),
    );

    // Only place pin if it's a quick click (< 200ms) and minimal movement (< 5px)
    if (clickDuration > 200 || mouseMovement > 5) {
      return;
    }

    const svg = evt.target.closest("svg");
    if (!svg) {
      return;
    }

    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;

    const { x, y } = pt.matrixTransform(svg.getScreenCTM().inverse());
    const coords = projection.invert([x, y]);

    if (coords && coords.length === 2) {
      const [lng, lat] = coords;

      // Clamp values to valid ranges
      const clampedLat = Math.max(-85, Math.min(85, lat));
      const clampedLng = Math.max(-180, Math.min(180, lng));

      actions.placePin(clampedLat, clampedLng);
    } else {
      console.log("❌ Invalid coordinates from projection");
    }
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border bg-background">
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{
          scale: 120,
          center: [0, 0],
        }}
        width={800}
        height={400}
        style={{ width: "100%", height: "100%", cursor: "crosshair" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies, projection }: any) => (
            <g onClick={handleClick(projection)} onMouseDown={handleMouseDown}>
              <rect fill="transparent" width={800} height={400} />
              {geographies.map((geo: any) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="var(--secondary)"
                  stroke="var(--primary)"
                  strokeWidth={0.5}
                  style={{
                    default: {
                      fill: "var(--secondary)",
                      stroke: "var(--primary)",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: "var(--muted)",
                      stroke: "var(--primary)",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    pressed: {
                      fill: "var(--muted)",
                      stroke: "var(--primary)",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                  }}
                />
              ))}
            </g>
          )}
        </Geographies>

        {/* Render all pins */}
        {mapData.pins.map((pin) => {
          const isUserPin = Boolean(
            hasPin &&
              userPin &&
              pin.latitude === userPin.latitude &&
              pin.longitude === userPin.longitude,
          );

          return (
            <Marker key={pin.id} coordinates={[pin.longitude, pin.latitude]}>
              <foreignObject x="-4" y="-8" width="20" height="20">
                <Pin
                  size={8}
                  style={{
                    color: isUserPin ? "var(--primary)" : "var(--primary)",
                    fill: isUserPin
                      ? "var(--destructive)"
                      : "var(--destructive)",
                  }}
                />
              </foreignObject>
            </Marker>
          );
        })}
      </ComposableMap>

      {/* Instructions overlay */}
      <div className="absolute bottom-2 left-2 right-2 z-10">
        <MapAuthGate
          fallback={
            <div className="bg-background/90 backdrop-blur-sm rounded-md p-2 text-center border">
              <p className="text-xs text-muted-foreground">
                Sign in to place your pin
              </p>
            </div>
          }
        ></MapAuthGate>
      </div>
    </div>
  );
}
