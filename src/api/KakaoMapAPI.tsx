// src/api/KakaoMapScriptLoader.tsx
import { useEffect } from "react";

interface KakaoMapScriptLoaderProps {
  onLoad: () => void;
}

const KakaoMapAPI = ({ onLoad }: KakaoMapScriptLoaderProps) => {
  useEffect(() => {
    if (document.getElementById("kakao-map-script")) {
      onLoad();
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-map-script";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_API_KEY
    }&autoload=false&libraries=services,clusterer`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log("✅ Kakao Map SDK loaded");
        onLoad();
      });
    };

    document.head.appendChild(script);
  }, [onLoad]);

  return null;
};

export default KakaoMapAPI;
