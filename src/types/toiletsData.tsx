export interface Toilet {
  id: number;
  toiletName: string;
  roadAddress: string;
  lotNumberAddress: string;
  maleToiletCount: number;
  maleUrinalCount: number;
  maleDisabledToiletCount: number;
  maleDisabledUrinalCount: number;
  maleChildToiletCount: number;
  maleChildUrinalCount: number;
  femaleToiletCount: number;
  femaleDisabledToiletCount: number;
  femaleChildToiletCount: number;
  openTime: string;
  latitude: number;
  longitude: number;
  toiletType: string;
}
export interface Location {
  latitude: number;
  longitude: number;
}

export interface MapProps {
  map: any;
}

export interface MarkersProps {
  map: any;
  toilets: Toilet[];
}

export interface UserLocationProps {
  map: any;
  location: Location | null;
}
