import { useEffect, useState } from "react";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import { useUserLocation } from "../api/UserLocation";
import UserLocationMarker from "./UserLocationMarker";
import UserLocationBtn from "./UserLocationBtn";
import SearchKeywordPanel from "./SearchKeywordPanel";
import type { SearchMarkerType, ToiletsMarkerType } from "../types/Types";
import useKakaoMapLoader from "../api/KakaomapLoader";
import { fetchNearbyToilets } from "../api/NearbyToilets";
import NBToilet from "./NearByToilet";

const KakaoMap = () => {
  useKakaoMapLoader();

  const { userLocation } = useUserLocation();
  const [toiletMarkers, setToiletMarkers] = useState<ToiletsMarkerType[]>([]);
  const [searchMarkers, setSearchMarkers] = useState<SearchMarkerType[]>([]);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  // 기준 위치 상태 (줌 변경 시 이 기준으로 재요청)
  const [centerLatLng, setCenterLatLng] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // 내 위치로 이동 + 기준 좌표 업데이트
  const moveToUserLocation = async () => {
    if (map && userLocation) {
      const { latitude, longitude } = userLocation;
      map.setCenter(new kakao.maps.LatLng(latitude, longitude));
      map.setLevel(3);
      setCenterLatLng({ latitude, longitude });
    }
  };

  // map, userLocation 준비되면 초기 기준 위치 설정
  useEffect(() => {
    if (map && userLocation) {
      setCenterLatLng({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
    }
  }, [map, userLocation]);

  // 줌 변경 시 기준 위치 기준으로 재요청
  useEffect(() => {
    if (!map || !centerLatLng) return;

    const handleZoomChanged = async () => {
      const level = map.getLevel();

      let radius = 500;
      if (level <= 3) radius = 300;
      else if (level <= 5) radius = 500;
      else if (level <= 7) radius = 1000;
      else radius = 2000;

      try {
        const toilets = await fetchNearbyToilets({
          latitude: centerLatLng.latitude,
          longitude: centerLatLng.longitude,
          radius,
        });
        setToiletMarkers(toilets);
        console.log("Zoom 변경에 따른 화장실 재요청", toilets);
      } catch (e) {
        console.error("Zoom 변경 시 요청 실패", e);
      }
    };

    handleZoomChanged(); // 최초에도 한 번 실행
    kakao.maps.event.addListener(map, "zoom_changed", handleZoomChanged);

    return () => {
      kakao.maps.event.removeListener(map, "zoom_changed", handleZoomChanged);
    };
  }, [map, centerLatLng]);

  // 검색 마커 클릭 시 해당 위치로 중심 이동 + 기준 좌표 변경
  const onSearchMarker = async (lat: number, lng: number) => {
    if (!map) return;
    map.setCenter(new kakao.maps.LatLng(lat, lng));
    map.setLevel(3);
    setCenterLatLng({ latitude: lat, longitude: lng });

    try {
      const toilets = await fetchNearbyToilets({
        latitude: lat,
        longitude: lng,
        radius: 500,
      });
      setToiletMarkers(toilets);
      console.log("마커클릭 후 화장실 검색 완료", toilets);
    } catch (e) {
      console.error("마커 클릭 후 화장실 검색 실패", e);
    }
  };

  if (!userLocation) return <div>로딩중...</div>;

  return (
    <div className="w-[500px]">
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

        {/* 검색 결과 마커 */}
        {searchMarkers.map((marker, idx) => (
          <div key={`marker-${idx}`}>
            <MapMarker
              position={marker.position}
              onClick={() =>
                onSearchMarker(marker.position.lat, marker.position.lng)
              }
              image={{
                src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                size: { width: 28, height: 40 },
              }}
            />
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

        {/* 화장실 마커 */}
        <NBToilet markers={toiletMarkers} />
      </Map>

      {/* 키워드 검색 UI */}
      <SearchKeywordPanel
        map={map}
        markers={searchMarkers}
        setMarkers={setSearchMarkers}
        setToiletMarkers={setToiletMarkers}
      />
    </div>
  );
};

export default KakaoMap;
