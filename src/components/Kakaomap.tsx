import { useEffect, useRef, useState } from "react";
import { useCurrentLocation } from "../api/currentLocation";

declare global {
  interface Window {
    kakao: any;
  }
}
export interface Toilet {
  id: number;
  toiletName: string;
  roadAddress: string;
  lotNumberAddress: string;
  maleToiletCount: number;
  maleUrinalCount: number;
  maleDisabledToiletCount: number;
  maleDisabledUrinalCount: number;
  maleChildToiletCount: number;
  maleChildUrinalCount: number;
  femaleToiletCount: number;
  femaleDisabledToiletCount: number;
  femaleChildToiletCount: number;
  openTime: string;
  latitude: number;
  longitude: number;
  toiletType: string;
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
          level: 2, //숫자가 클수록 많이 축소됨
        });

        setMapInstance(mapInstance);
        console.log("🗺️ 지도 생성 완료");
      });
    };

    document.head.appendChild(script); //HTML head태그 안에 스크립트 태그를 직접 추가하는 코드
  }, []);

  // 2. 위치가 잡히고, 지도가 준비되면 마커 찍기
  const overlayRef = useRef<any>(null);

  useEffect(() => {
    if (!location || !map || !window.kakao) {
      return;
    }

    const { latitude, longitude } = location;
    const userPosition = new window.kakao.maps.LatLng(latitude, longitude);

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

  useEffect(() => {
    if (!map || toilets.length === 0) return;

    toilets.forEach((toilet) => {
      const position = new window.kakao.maps.LatLng(
        toilet.latitude,
        toilet.longitude
      );

      const marker = new window.kakao.maps.Marker({
        map,
        position,
      });

      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:6px;font-size:14px;">🚻 ${toilet.toiletName}</div>`,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        infoWindow.open(map, marker);
      });
    });
  }, [map, toilets]);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "500px" }} />
  );
};

export default KakaoMap;
