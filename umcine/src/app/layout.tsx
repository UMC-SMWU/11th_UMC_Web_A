import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "UMCine",
    template: "%s | UMCine",
  },
  description: "TMDB 영화 정보를 둘러보고 평점과 즐겨찾기를 남겨요.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            {/* 헤더는 현재 경로(usePathname)를 읽으므로 Suspense로 감싸요 */}
            <Suspense fallback={<div className="h-[91px] bg-white" />}>
              <Header />
            </Suspense>
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}