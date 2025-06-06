import { useEffect, useState } from "react";
import {
  useKakaoLoader,
  Map,
  MapMarker,
  CustomOverlayMap,
} from "react-kakao-maps-sdk";
import { useUserLocation } from "../api/UserLocation";
import UserLocationMarker from "./UserLocationMarker";
import UserLocationBtn from "./UserLocationBtn";
import SearchKeywordPanel from "./SearchKeywordPanel";
import type { MarkerType } from "../types/Types";

const KakaoMap = () => {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAOMAP_API_KEY,
    libraries: ["services"],
  });

  const { userLocation } = useUserLocation();
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const moveToUserLocation = () => {
    if (map && userLocation) {
      map.setCenter(
        new kakao.maps.LatLng(userLocation.latitude, userLocation.longitude)
      );
      map.setLevel(3);
    }
  };

  if (loading || !userLocation) return <div>로딩중...</div>;
  if (error) alert("지도를 불러오는데 실패했습니다!");

  return (
    <div className="w-[320px]">
      {/*지도 */}
      <div>
        <UserLocationBtn moveToUserLocation={moveToUserLocation} />
        <Map
          center={{
            lat: userLocation.latitude,
            lng: userLocation.longitude,
          }}
          style={{ width: "100%", height: "500px" }}
          level={3}
          onCreate={setMap}
        >
          <UserLocationMarker
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
          />
          {markers.map((marker, idx) => (
            <div key={`marker-${idx}`}>
              <MapMarker position={marker.position} />
              <CustomOverlayMap position={marker.position} yAnchor={2.5}>
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
                  {marker.content}
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
            </div>
          ))}
        </Map>
      </div>
      <SearchKeywordPanel map={map} markers={markers} setMarkers={setMarkers} />
    </div>
  );
};

export default KakaoMap;
