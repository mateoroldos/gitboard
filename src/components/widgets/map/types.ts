export interface MapPin {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  createdAt: number;
}

export interface MapData {
  title: string;
  pins: MapPin[];
  showStats: boolean;
}

export interface UserPin {
  latitude: number;
  longitude: number;
}

export interface MapConfig {
  title: string;
  showStats: boolean;
}

