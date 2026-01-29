"use client";

import { useKakaoLoader } from "react-kakao-maps-sdk";

export default function KakaoMapLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, error] = useKakaoLoader({
    appkey: "98a168135a4d6543d356555652f15592",
    libraries: ["clusterer"],
  });

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">지도를 불러오는 중...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">지도를 불러오지 못했습니다.</p>
      </div>
    );

  return <>{children}</>;
}
