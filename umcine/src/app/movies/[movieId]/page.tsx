import { Suspense } from "react";
import { MovieDetailPage } from "@/screens/movies/movie-detail-page";

interface MovieDetailRouteProps {
  params: Promise<{ movieId: string }>;
}

export default function MovieDetailRoute({ params }: MovieDetailRouteProps) {
  return (
    <Suspense fallback={<main className="px-20 py-10">영화 정보를 불러오는 중이에요.</main>}>
      <MovieDetailContent params={params} />
    </Suspense>
  );
}

async function MovieDetailContent({ params }: MovieDetailRouteProps) {
  const { movieId } = await params;

  return <MovieDetailPage movieId={movieId} />;
}