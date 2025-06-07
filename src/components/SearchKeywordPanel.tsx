import { useState } from "react";
import SearchKeyWord from "./SearchKeyWord";
import type { SearchMarkerType, ToiletsMarkerType } from "../types/Types";
import { fetchNearbyToilets } from "../api/NearbyToilets";

interface Props {
  map: kakao.maps.Map | null;
  markers: SearchMarkerType[];
  setMarkers: React.Dispatch<React.SetStateAction<SearchMarkerType[]>>;
  setToiletMarkers: React.Dispatch<React.SetStateAction<ToiletsMarkerType[]>>;
}
const SearchKeywordPanel = ({
  map,
  markers,
  setMarkers,
  setToiletMarkers,
}: Props) => {
  const [keyword, setKeyword] = useState("");

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
  const handleClickMarker = async (marker: SearchMarkerType) => {
    if (!map) return;

    // 지도 중심 이동
    const latlng = new kakao.maps.LatLng(
      marker.position.lat,
      marker.position.lng
    );
    map.setCenter(latlng);
    map.setLevel(3);

    // 주변 화장실 검색
    const toilets = await fetchNearbyToilets({
      latitude: marker.position.lat,
      longitude: marker.position.lng,
      radius: 500,
    });
    setToiletMarkers(toilets);
  };
  return (
    <div className="h-[500px]">
      <SearchKeyWord
        onSearch={onSearch}
        keyword={keyword}
        setKeyword={setKeyword}
      />
      <hr style={{ borderTop: "2px solid #5F5F5F", margin: "6px 0" }} />
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
        {map ? (
          <ul style={{ listStyle: "none", padding: "0px" }}>
            {markers.length === 0 ? (
              <p>검색 결과가 없습니다.</p>
            ) : (
              markers.map((marker, idx) => (
                <li
                  key={`list-${idx}`}
                  style={{
                    borderBottom: "1px solid #888",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                  }}
                  onClick={() => handleClickMarker(marker)}
                >
                  <h5>{marker.content}</h5>
                </li>
              ))
            )}
          </ul>
        ) : (
          <p>지도가 로드되지 않았습니다.</p>
        )}
      </div>
    </div>
  );
};

export default SearchKeywordPanel;
