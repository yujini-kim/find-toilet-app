// src/hooks/useCurrentLocation.ts
import { useEffect, useState } from "react";
import type { Location } from "../types/toiletsData";

export function useCurrentLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("이 브라우저는 위치 정보를 지원하지 않아요.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (err) => {
        setError("위치 정보를 가져오는 데 실패했어요.");
        console.error("Geolocation error:", err);
      }
    );
  }, []);

  return { location, error };
}
