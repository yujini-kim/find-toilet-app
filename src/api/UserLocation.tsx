import { useEffect, useState } from "react";
import type { UserLocationProps } from "../types/Types";

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState<UserLocationProps | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("이 브라우저는 위치 정보를 지원하지 않아요.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      (err) => {
        setError("위치 정보를 가져오는 데 실패했어요.");
        console.error("현재 위치정보 에러:", err);
      }
    );
  }, []);

  return { userLocation, error };
}
