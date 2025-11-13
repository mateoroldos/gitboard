import type { MapConfig, MapData } from "./types";

export function createPreviewMapData(config: MapConfig): MapData | null {
  if (!config.title) {
    return null;
  }

  // Create some sample pins for preview
  const samplePins = [
    {
      id: "preview-1",
      userId: "user1",
      latitude: 40.7128,
      longitude: -74.006,
      createdAt: Date.now() - 86400000, // 1 day ago
    },
    {
      id: "preview-2",
      userId: "user2",
      latitude: 51.5074,
      longitude: -0.1278,
      createdAt: Date.now() - 172800000, // 2 days ago
    },
    {
      id: "preview-3",
      userId: "user3",
      latitude: 35.6762,
      longitude: 139.6503,
      createdAt: Date.now() - 259200000, // 3 days ago
    },
  ];

  return {
    title: config.title,
    pins: samplePins,
    showUserInfo: config.showUserInfo,
    showStats: config.showStats,
  };
}

// Utility functions for coordinate conversion and map helpers
export function convertScreenToGeo(
  x: number,
  y: number,
  width: number,
  height: number,
): { lat: number; lng: number } {
  // Convert screen coordinates to approximate lat/lng for Natural Earth projection
  const lng = (x / width) * 360 - 180;
  const lat = 90 - (y / height) * 180;

  // Clamp values to valid ranges
  const clampedLat = Math.max(-85, Math.min(85, lat));
  const clampedLng = Math.max(-180, Math.min(180, lng));

  return { lat: clampedLat, lng: clampedLng };
}

