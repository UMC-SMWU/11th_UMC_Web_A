import { Suspense } from "react";
import { MovieDetailPage } from "../../views/movies/movie-detail-page";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[50vh] items-center justify-center">
          <p className="text-[#999999]">영화 상세 정보를 불러오는 중이에요.</p>
        </main>
      }
    >
      <MovieDetailPage />
    </Suspense>
  );
}