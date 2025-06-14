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
            address: place.road_address_name || place.address_name,
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
    map.setLevel(5);

    // 주변 화장실 검색
    const toilets = await fetchNearbyToilets({
      latitude: marker.position.lat,
      longitude: marker.position.lng,
      radius: 500,
    });
    setToiletMarkers(toilets);
  };
  return (
    <div style={{ height: "500px" }}>
      <SearchKeyWord
        onSearch={onSearch}
        keyword={keyword}
        setKeyword={setKeyword}
      />
      <hr style={{ borderTop: "2px solid #59abe3", margin: "10px 0" }} />

      {map ? (
        <ul
          style={{
            listStyle: "none",
            padding: "8px",
            margin: "0px",
            overflowY: "scroll",
            height: "100%",
          }}
        >
          {markers.length === 0 ? (
            <p>검색 결과가 없습니다.</p>
          ) : (
            markers.map((marker, idx) => (
              <>
                <li
                  key={`list-${idx}`}
                  style={{
                    cursor: "pointer",
                    alignItems: "center",
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                  onClick={() => handleClickMarker(marker)}
                >
                  <h1 style={{ fontSize: "14px" }}>{marker.content}</h1>
                  <span style={{ fontSize: "12px", color: "#555" }}>
                    {marker.address}
                  </span>
                </li>
                <hr
                  style={{ borderTop: "1px solid #b9b9b9", margin: "10px 0" }}
                />
              </>
            ))
          )}
        </ul>
      ) : (
        <p>지도가 로드되지 않았습니다.</p>
      )}
    </div>
  );
};

export default SearchKeywordPanel;
