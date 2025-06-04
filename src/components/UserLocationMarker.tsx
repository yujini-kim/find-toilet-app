import { useEffect, useRef } from "react";
import type { UserLocationProps } from "../types/toiletsData";

const UserLocationMarker = ({ map, location }: UserLocationProps) => {
  const overlayRef = useRef<any>(null);
  useEffect(() => {
    if (!location || !map || !window.kakao) {
      return;
    }

    const userPosition = new window.kakao.maps.LatLng(
      location.latitude,
      location.longitude
    );

    const marker = new window.kakao.maps.Marker({
      position: userPosition,
    });

    marker.setMap(map); //지도에 마커 찍기기

    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: userPosition,
      content: `
        <div style="
          background: white;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 12px;
          text-align: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          border: none;
        ">
          📍 내 위치
        </div>
      `,
      yAnchor: 2.5,
    });

    // 상태 추적을 위해 ref에 저장
    overlayRef.current = customOverlay;

    // 마커 클릭 시 toggle
    window.kakao.maps.event.addListener(marker, "click", function () {
      if (overlayRef.current.getMap()) {
        //말풍선이 붙어있는지 확인하는 함수
        overlayRef.current.setMap(null);
      } else {
        overlayRef.current.setMap(map);
      }
    });

    // 최초 1회 표시
    customOverlay.setMap(map);
    map.setCenter(userPosition);
  }, [location, map]);
  return null;
};

export default UserLocationMarker;
