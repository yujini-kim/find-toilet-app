export interface ToiletsProps {
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
export interface UserLocationProps {
  latitude: number;
  longitude: number;
}
