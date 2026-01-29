"use client";

import dynamic from "next/dynamic";

const KakaoMapLoader = dynamic(
  () => import("./components/KakaoMapLoader"),
  { ssr: false },
);

const SchoolMap = dynamic(() => import("./components/SchoolMap"), {
  ssr: false,
});

export default function Home() {
  return (
    <KakaoMapLoader>
      <SchoolMap />
    </KakaoMapLoader>
  );
}
