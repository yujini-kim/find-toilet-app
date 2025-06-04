import { useEffect, useRef, useState } from "react";
import { useCurrentLocation } from "../api/currentLocation";
import type { Toilet } from "../types/toiletsData";
import UserLocationMarker from "./UserLocationMarker";
import ToiletsMarks from "./ToiletsMarkter";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  toilets: Toilet[];
}

const KakaoMap = ({ toilets }: KakaoMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMapInstance] = useState<any>(null);
  const { location } = useCurrentLocation();

  // 1. Kakao Map script 로드 및 지도 생성
  useEffect(() => {
    if (!location) return;
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAOMAP_API_KEY
    }&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapContainerRef.current) return;

        const defaultCenter = new window.kakao.maps.LatLng(
          location?.latitude,
          location?.longitude
        );
        const mapInstance = new window.kakao.maps.Map(mapContainerRef.current, {
          center: defaultCenter,
          level: 2, //숫자가 클수록 많이 축소됨
        });

        setMapInstance(mapInstance);
        console.log("🗺️ 지도 생성 완료");
      });
    };

    document.head.appendChild(script); //HTML head태그 안에 스크립트 태그를 직접 추가하는 코드
  }, [location]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "500px" }}>
      {map && (
        <>
          <UserLocationMarker map={map} location={location} />
          <ToiletsMarks map={map} toilets={toilets} />
        </>
      )}
    </div>
  );
};

export default KakaoMap;
