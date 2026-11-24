import type { Metadata } from "next";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import { MovieDetailPage } from "@/screens/movies/movie-detail-page";
import { getTmdbPosterUrl } from "@/utils/movies/tmdb-image";

interface PageProps {
  params: Promise<{ movieId: string }>;
}

// 영화마다 탭 제목과 링크 공유 미리보기를 다르게 설정해요.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { movieId } = await params;
  const id = Number(movieId);
  if (!Number.isInteger(id) || id <= 0) return { title: "영화 상세" };

  try {
    const movie = await getMovieDetail(id);
    const posterUrl = getTmdbPosterUrl(movie.poster_path);
    return {
      title: movie.title,
      description: movie.overview || undefined,
      openGraph: {
        title: movie.title,
        description: movie.overview || undefined,
        images: posterUrl ? [posterUrl] : [],
      },
    };
  } catch {
    return { title: "영화 상세" };
  }
}

export default async function Page({ params }: PageProps) {
  const { movieId } = await params;
  return <MovieDetailPage movieId={movieId} />;
}
