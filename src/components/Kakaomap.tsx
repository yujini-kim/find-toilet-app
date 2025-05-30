import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAOMAP_API_KEY
    }&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (mapContainerRef.current) {
          const options = {
            center: new window.kakao.maps.LatLng(33.450701, 126.570667),
            level: 3,
          };
          new window.kakao.maps.Map(mapContainerRef.current, options);
        }
      });
    };

    document.head.appendChild(script);
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "500px" }} />
  );
};

export default KakaoMap;
