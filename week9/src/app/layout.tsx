import type { Metadata } from "next";
import Providers from "./providers";
import Header from "@/components/layout/header";
import "./globals.css";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "UMCine",
  description: "영화 정보를 확인하는 UMCine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="min-h-screen bg-[#F6F7F9]">
            <Suspense fallback={<div className="h-[86px] w-full bg-white" />}>
              <Header />
            </Suspense>

            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
