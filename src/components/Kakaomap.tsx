import { useEffect, useRef, useState } from "react";
import { useCurrentLocation } from "../api/currentLocation";

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const { location } = useCurrentLocation();

  // 1. Kakao Map script 로드 및 지도 생성
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAOMAP_API_KEY
    }&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapContainerRef.current) return;

        const defaultCenter = new window.kakao.maps.LatLng(
          33.450701,
          126.570667
        );
        const mapInstance = new window.kakao.maps.Map(mapContainerRef.current, {
          center: defaultCenter,
          level: 3,
        });

        setMap(mapInstance); // ✅ 지도 인스턴스 저장
        console.log("🗺️ 지도 생성 완료");
      });
    };

    document.head.appendChild(script);
  }, []);

  // 2. 위치가 잡히고, 지도가 준비되면 마커 찍기
  useEffect(() => {
    if (!location || !map || !window.kakao) {
      console.warn("⚠️ 마커를 찍기 위한 조건이 부족합니다.", { location, map });
      return;
    }

    const { latitude, longitude } = location;
    const userPosition = new window.kakao.maps.LatLng(latitude, longitude);

    const marker = new window.kakao.maps.Marker({
      position: userPosition,
    });

    marker.setMap(map);
    map.setCenter(userPosition);

    console.log("📍 현재 위치 마커 찍기 성공:", latitude, longitude);
  }, [location, map]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "500px" }} />
  );
};

export default KakaoMap;
