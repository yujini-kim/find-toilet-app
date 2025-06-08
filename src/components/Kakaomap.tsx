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

  const moveToUserLocation = async () => {
    if (map && userLocation) {
      map.setCenter(
        new kakao.maps.LatLng(userLocation.latitude, userLocation.longitude)
      );
      map.setLevel(3);
    }
  };

  useEffect(() => {
    if (!userLocation || !map) return;
    const fetchToiletList = async () => {
      try {
        const toilets = await fetchNearbyToilets({
          latitude: userLocation?.latitude,
          longitude: userLocation?.longitude,
          radius: 500,
        });
        setToiletMarkers(toilets);
      } catch {}
    };
    fetchToiletList();
  }, [userLocation, map]);

  useEffect(() => {
    console.log("업데이트된 화장실 마커:", toiletMarkers);
  }, [toiletMarkers]);

  if (!userLocation) return <div>로딩중...</div>;

  const onSearchMarker = async (lat: number, lng: number) => {
    if (!map) return;
    map.setCenter(new kakao.maps.LatLng(lat, lng));
    map.setLevel(3);

    try {
      const toilets = await fetchNearbyToilets({
        latitude: lat,
        longitude: lng,
        radius: 500,
      });

      setToiletMarkers(
        toilets.map((t: any) => ({
          latitude: Number(t.latitude),
          longitude: Number(t.longitude),
          toiletName: t.toiletName || "공중화장실",
        }))
      );
      console.log("마커클릭 후 화장실 검색 완료", toilets);
    } catch (e) {
      console.error("마커 클릭 후 화장실 검색 실패", e);
    }
  };

  return (
    <div className="w-[500px]">
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
          <NBToilet markers={toiletMarkers} />
        </Map>
      </div>
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
