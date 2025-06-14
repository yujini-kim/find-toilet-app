import { CustomOverlayMap, MapMarker } from "react-kakao-maps-sdk";
import type { ToiletsMarkerType } from "../types/Types";
import { useState } from "react";
import ToiletInfo from "./ToiletInfo";

interface Props {
  markers: ToiletsMarkerType[];
}

export default function NBToilet({ markers }: Props) {
  const [selectedMarker, setSelectedMarker] =
    useState<ToiletsMarkerType | null>(null);

  return (
    <>
      {markers.map((marker, idx) => (
        <div key={idx}>
          <MapMarker
            position={{ lat: marker.latitude, lng: marker.longitude }}
            onClick={() => setSelectedMarker(marker)}
          />
          <CustomOverlayMap
            position={{ lat: marker.latitude, lng: marker.longitude }}
            yAnchor={2.4}
          >
            <div
              style={{
                position: "relative",
                backgroundColor: "white",
                padding: "6px 10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                fontSize: "12px",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              🔵{marker.toiletName}
            </div>
          </CustomOverlayMap>
        </div>
      ))}
      {selectedMarker && (
        <ToiletInfo
          toiletName={selectedMarker.toiletName}
          roadAddress={selectedMarker.roadAddress}
          lotNumberAddress={selectedMarker.lotNumberAddress}
          openTime={selectedMarker.openTime}
          maleToiletCount={selectedMarker.maleToiletCount}
          maleUrinalCount={selectedMarker.maleUrinalCount}
          femaleToiletCount={selectedMarker.femaleToiletCount}
          maleDisabledToiletCount={selectedMarker.maleDisabledToiletCount}
          femaleDisabledToiletCount={selectedMarker.femaleDisabledToiletCount}
          setSelectedMarker={setSelectedMarker}
        />
      )}
    </>
  );
}
