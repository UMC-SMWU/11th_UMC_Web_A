import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { TmdbAttribution } from "@/components/layout/tmdb-attribution";
import { Providers } from "./providers";
import "./globals.css";

// 모든 페이지가 함께 쓰는 기본 정보예요. 각 page.tsx의 title은 "%s | UMCine" 형식으로 붙어요.
export const metadata: Metadata = {
  title: { default: "UMCine - 영화 목록", template: "%s | UMCine" },
  description: "인기 영화를 둘러보고 즐겨찾기와 평점을 남기는 영화 서비스",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "UMCine",
    description: "인기 영화를 둘러보고 즐겨찾기와 평점을 남기는 영화 서비스",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-surface text-ink">
        <Providers>
          <Header />
          {children}
          <TmdbAttribution />
        </Providers>
      </body>
    </html>
  );
}
