import { CustomOverlayMap, MapMarker } from "react-kakao-maps-sdk";
import type { UserLocationProps } from "../types/Types";
import { useState } from "react";

const UserLocationMarker = ({ latitude, longitude }: UserLocationProps) => {
  const [markerClick, setmarkerClick] = useState(true);
  const onHandleMarker = () => {
    setmarkerClick((props) => !props);
  };

  return (
    <>
      <MapMarker
        position={{ lat: latitude, lng: longitude }}
        onClick={onHandleMarker}
      />
      {markerClick && (
        <CustomOverlayMap
          position={{
            lat: latitude,
            lng: longitude,
          }}
          yAnchor={2.6}
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
            📍 내 위치!
            <div
              style={{
                position: "absolute",
                bottom: "-6px",
                left: "50%",
                width: "10px",
                height: "10px",
                backgroundColor: "white",
                borderLeft: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
                transform: "translateX(-50%) rotate(45deg)",
              }}
            />
          </div>
        </CustomOverlayMap>
      )}
    </>
  );
};

export default UserLocationMarker;
