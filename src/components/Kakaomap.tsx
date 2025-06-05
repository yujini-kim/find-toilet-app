import { useKakaoLoader, Map } from "react-kakao-maps-sdk";
import { useUserLocation } from "../api/UserLocation";
import UserLocationMarker from "./UserLocationMarker";

const KakaoMap = () => {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAOMAP_API_KEY,
    libraries: ["services"],
  });

  const { userLocation } = useUserLocation();

  if (loading || !userLocation) {
    return <div>로딩중...</div>;
  }
  if (error) {
    alert("지도를 불러오는데 실패했습니다!");
  }

  return (
    <Map
      center={{ lat: userLocation.latitude, lng: userLocation.longitude }}
      style={{ width: "100%", height: "400px" }}
      level={3}
    >
      <UserLocationMarker
        latitude={userLocation.latitude}
        longitude={userLocation.longitude}
      />
    </Map>
  );
};

export default KakaoMap;
