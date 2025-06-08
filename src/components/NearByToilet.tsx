import { CustomOverlayMap, MapMarker } from "react-kakao-maps-sdk";
import type { ToiletsMarkerType } from "../types/Types";
import { useState } from "react";

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
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "700px",
            transform: "translateX(-50%)",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            width: "300px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <h3 className="font-bold text-lg mb-2">
            {selectedMarker.toiletName}
          </h3>
          <p>
            🚩
            {selectedMarker.roadAddress
              ? selectedMarker.roadAddress
              : selectedMarker.lotNumberAddress}
          </p>
          <p>
            🕒
            {selectedMarker.openTime
              ? selectedMarker.openTime
              : "정보가 제공되지 않아요"}
          </p>
          <hr className="my-2" />
          <p>🚻 남자 대변기: {selectedMarker.maleToiletCount}</p>
          <p>🚹 소변기: {selectedMarker.maleUrinalCount}</p>
          <p>🚺 여자 대변기: {selectedMarker.femaleToiletCount}</p>
          <p>
            ♿ 여자장애인 화장실:
            {selectedMarker.femaleDisabledToiletCount}
          </p>
          <p>♿ 남자장애인 화장실:{selectedMarker.maleDisabledToiletCount}</p>
          <button
            onClick={() => setSelectedMarker(null)}
            className="mt-3 px-4 py-1 border rounded bg-gray-100 hover:bg-gray-200"
          >
            닫기
          </button>
        </div>
      )}
    </>
  );
}
