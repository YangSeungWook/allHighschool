import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HiMap – 전국 고등학교 지도",
  description: "전국 고등학교를 한눈에 탐색할 수 있는 지도 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head />
      <body>{children}</body>
    </html>
  );
}
