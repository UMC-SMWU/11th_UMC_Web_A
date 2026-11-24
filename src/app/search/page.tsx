import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "@/screens/movies/search-page";

export const metadata: Metadata = { title: "영화 검색" };

export default function Page() {
  // SearchPage는 주소의 ?query= 값을 읽어요. 이 값은 요청을 받아야 알 수 있어서 Suspense로 감싸요.
  return (
    <Suspense fallback={null}>
      <SearchPage />
    </Suspense>
  );
}
