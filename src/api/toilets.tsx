export async function fetchNearbyToilets({
  latitude,
  longitude,
  radius,
}: {
  latitude: number;
  longitude: number;
  radius: number;
}) {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/api/toilets?lat=${latitude}&lng=${longitude}&radius=${radius}`
  );

  if (!res.ok) {
    throw new Error("화장실 정보를 불러오지 못했습니다");
  }

  return res.json();
}
