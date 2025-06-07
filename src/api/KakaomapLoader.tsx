import { useKakaoLoader } from "react-kakao-maps-sdk";

const useKakaoMapLoader = () => {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAOMAP_API_KEY,
    libraries: ["services"],
  });

  if (loading) {
    <div>"지도 로딩중"</div>;
  }
  if (error) {
    <div>지도 로딩 에러</div>;
  }
};

export default useKakaoMapLoader;
