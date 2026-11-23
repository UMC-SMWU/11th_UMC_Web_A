import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "@/screens/movies/search-page";

export const metadata: Metadata = { title: "영화 검색" };

interface SearchRouteProps {
  searchParams: Promise<{ query?: string | string[] }>;
}

export default function SearchRoute({ searchParams }: SearchRouteProps) {
  return (
    <Suspense fallback={<main className="px-20 py-10">검색 페이지를 준비하는 중이에요.</main>}>
      <SearchContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchContent({ searchParams }: SearchRouteProps) {
  const { query } = await searchParams;

  return <SearchPage query={typeof query === "string" ? query : undefined} />;
}