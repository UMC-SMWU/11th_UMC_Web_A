import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/layout/header";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "UMCine",
  description: "영화 목록, 검색, 즐겨찾기",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}