import { useEffect } from "react";
import type { MarkersProps } from "../types/toiletsData";

const ToiletsMarks = ({ map, toilets }: MarkersProps) => {
  useEffect(() => {
    if (!map) return;

    toilets?.forEach((toilet) => {
      const position = new window.kakao.maps.LatLng(
        toilet.latitude,
        toilet.longitude
      );

      const marker = new window.kakao.maps.Marker({
        map,
        position,
      });

      const toiletsMarker = new window.kakao.maps.CustomOverlay({
        position,
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
         🚻 ${toilet.toiletName}
        </div>
      `,
        yAnchor: 2.5,
      });

      // 처음에는 숨겨놓고 클릭 시 toggle
      let isVisible = false;

      window.kakao.maps.event.addListener(marker, "click", () => {
        if (isVisible) {
          toiletsMarker.setMap(null);
          isVisible = false;
        } else {
          toiletsMarker.setMap(map);
          isVisible = true;
        }
      });
    });
  }, [map, toilets]);

  return null;
};

export default ToiletsMarks;
