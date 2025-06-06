import { useState } from "react";
import SearchKeyWord from "./SearchKeyWord";
import type { MarkerType } from "../types/Types";

interface Props {
  map: kakao.maps.Map | null;
  markers: MarkerType[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkerType[]>>;
}
const SearchKeywordPanel = ({ map, markers, setMarkers }: Props) => {
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
                  onClick={() => {
                    map.setCenter(
                      new kakao.maps.LatLng(
                        marker.position.lat,
                        marker.position.lng
                      )
                    );
                    map.setLevel(3);
                  }}
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
