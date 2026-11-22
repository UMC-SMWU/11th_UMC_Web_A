import { Suspense } from "react";
import { MovieDetailPage } from "@/screens/movies/movie-detail-page";

export default function MoviePage() {
  return (
    <Suspense fallback={<main>영화 상세 정보를 불러오는 중이에요.</main>}>
      <MovieDetailPage />
    </Suspense>
  );
}
