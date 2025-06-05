import { useEffect, useState } from "react";
import {
  useKakaoLoader,
  Map,
  MapMarker,
  CustomOverlayMap,
} from "react-kakao-maps-sdk";
import { useUserLocation } from "../api/UserLocation";
import UserLocationMarker from "./UserLocationMarker";
import SearchKeyWord from "./SearchKeyWord";
import UserLocationBtn from "./UserLocationBtn";

type MarkerType = {
  position: {
    lat: number;
    lng: number;
  };
  content: string;
};

const KakaoMap = () => {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAOMAP_API_KEY,
    libraries: ["services"],
  });

  const { userLocation } = useUserLocation();
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [keyword, setKeyword] = useState("");
  const moveToUserLocation = () => {
    if (map && userLocation) {
      map.setCenter(
        new kakao.maps.LatLng(userLocation.latitude, userLocation.longitude)
      );
      map.setLevel(3);
    }
  };
  const onSearch = () => {
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();
        const newMarkers = data.map((place) => {
          bounds.extend(
            new kakao.maps.LatLng(Number(place.y), Number(place.x))
          );
          return {
            position: {
              lat: Number(place.y),
              lng: Number(place.x),
            },
            content: place.place_name,
          };
        });

        setMarkers(newMarkers);
        map?.setBounds(bounds);
      }
    });
  };

  if (loading || !userLocation) return <div>로딩중...</div>;
  if (error) alert("지도를 불러오는데 실패했습니다!");

  return (
    <div style={{ display: "flex", height: "500px" }}>
      <div
        style={{ display: "flex", flexDirection: "column", height: "500px" }}
      >
        <SearchKeyWord
          onSearch={onSearch}
          keyword={keyword}
          setKeyword={setKeyword}
        />
        <hr style={{ borderTop: "2px solid #5F5F5F", margin: "6px 0" }} />
        {/* 왼쪽 검색 목록 */}
        <div
          style={{
            width: "250px",
            padding: "5px",
            overflowY: "auto",
            background: "rgba(255, 255, 255, 0.7)",
            fontSize: "12px",
            borderRadius: "10px",
          }}
        >
          {markers.length === 0 ? (
            <p>검색 결과가 없습니다.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: "0px" }}>
              {markers.map((marker, idx) => (
                <li
                  key={`list-${idx}`}
                  style={{
                    borderBottom: "1px solid #888",
                    overflow: "hidden",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                  }}
                  onClick={() => {
                    map?.setCenter(
                      new kakao.maps.LatLng(
                        marker.position.lat,
                        marker.position.lng
                      )
                    );
                    map?.setLevel(3);
                  }}
                >
                  <h5>{marker.content}</h5>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* 오른쪽 지도 */}
      <div style={{ flex: 1, position: "relative" }}>
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
    </div>
  );
};

export default KakaoMap;
