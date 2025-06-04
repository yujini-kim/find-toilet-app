import { useEffect, useState } from "react";
import { useCurrentLocation } from "./api/currentLocation";
import { fetchNearbyToilets } from "./api/toilets";
import CurrenLoacationBtn from "./components/CurrentLocationBtn";
import KakaoMap from "./components/Kakaomap";

function Home() {
  const { location } = useCurrentLocation();
  const [toilets, setToilets] = useState([]);

  const handleClick = async () => {
    if (!location) return;
    const data = await fetchNearbyToilets({
      latitude: location.latitude,
      longitude: location.longitude,
      radius: 1000,
    });
    setToilets(data);
    console.log(data);
  };

  useEffect(() => {
    if (location) {
      handleClick();
    }
  }, [location]);

  return (
    <>
      <KakaoMap toilets={toilets} />
      <CurrenLoacationBtn onClick={handleClick} />
    </>
  );
}

export default Home;
