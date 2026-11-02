import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { getMovieDetailErrorMessage } from "../../api/movies/get-movie-detail-error-message";
import { cn } from "../../utils/cn";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieDetailPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);

  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [detailResult, setDetailResult] = useState<{
    movieId: number;
    movie: TmdbMovieDetail | null;
    errorMessage: string | null;
  } | null>(null);

  const isLoading = isValidMovieId && detailResult?.movieId !== parsedMovieId;

  const movie =
    isValidMovieId && detailResult?.movieId === parsedMovieId
      ? detailResult.movie
      : null;

  const errorMessage = !isValidMovieId
    ? "올바르지 않은 영화 번호예요."
    : detailResult?.movieId === parsedMovieId
      ? detailResult.errorMessage
      : null;

  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(parsedMovieId),
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  useEffect(() => {
    if (!isValidMovieId) return;

    let ignore = false;

    getMovieDetail(parsedMovieId)
      .then((response) => {
        if (!ignore) {
          setDetailResult({
            movieId: parsedMovieId,
            movie: response,
            errorMessage: null,
          });
        }
      })
      .catch((error: unknown) => {
        if (!ignore) {
          setDetailResult({
            movieId: parsedMovieId,
            movie: null,
            errorMessage: getMovieDetailErrorMessage(error),
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [parsedMovieId, isValidMovieId]);

  if (!isValidMovieId) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-lg text-gray-500">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-lg text-gray-500">
        영화 정보를 불러오는 중...
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-lg text-gray-500">
        {errorMessage}
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-lg text-gray-500">
        영화 정보를 표시할 수 없어요.
      </main>
    );
  }

  const genres = (movie.genres ?? []).map((genre) => genre.name).join(" · ");

  const runtime =
    typeof movie.runtime === "number"
      ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
      : "상영 시간 정보가 없어요.";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : undefined;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : undefined;

  return (
    <main className="min-h-screen bg-[#F6F7F9] text-gray-900 pb-16">
      <section className="relative h-[380px] w-full overflow-hidden bg-black text-white">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

        <div className="relative mx-auto flex h-full max-w-8xl flex-col justify-between px-25 py-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-300 hover:text-white transition-colors"
          >
            <img src="/icons/chevron-left.svg" alt="" className="h-6 w-6" />
            <p className="text-[13px] font-bold leading-none text-center align-middle">
              영화 목록
            </p>
          </Link>

          <div className="mb-4">
            <h1 className="text-3xl font-bold leading-tight tracking-[-1.5px] md:text-[46px] md:leading-[49.68px] md:tracking-[-2.3px]">
              {movie.title}
            </h1>

            <p className="mt-1 text-sm font-normal leading-none text-gray-300">
              {movie.original_title}
            </p>

            <p className="mt-2 text-xs font-bold leading-3 text-gray-400 md:text-[13px] md:leading-[13px]">
              {movie.release_date} · {genres} · {runtime}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-full grid-cols-1 gap-8 px-25 md:grid-cols-3 bg-[#F6F7F9]">
        <div className="flex flex-col gap-6 md:col-span-2 md:flex-row">
          <div className="shrink-0">
            {posterUrl && (
              <img
                src={posterUrl}
                alt={`${movie.title} 포스터`}
                className="w-48 rounded-lg shadow-lg md:w-56"
              />
            )}
          </div>

          <div className="flex flex-col justify-start space-y-4">
            {movie.tagline && (
              <h2 className="text-[21px] font-bold leading-[21px] tracking-[-0.63px] text-gray-800">
                {movie.tagline}
              </h2>
            )}

            <p className="whitespace-pre-line text-[13px] font-normal leading-5 text-gray-600 sm:text-[14px] sm:leading-6">
              {movie.overview}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => toggleBookmark(movie.id)}
                className="rounded-md border border-gray-300 bg-[#2563EB] px-4 py-2 text-sm font-extrabold text-[#FFFFFF]"
              >
                {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 등록"}
              </button>
            </div>
          </div>
        </div>

        <div className="border-l border-gray-200 pl-8 h-full">
          <h3 className="text-lg font-bold text-gray-900">내 평점</h3>

          <p className="mt-1 text-xs text-gray-400">
            별점은 필수, 후기는 선택이에요.
          </p>

          <div className="my-4 flex space-x-1 text-2xl text-[#606774]">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star}점`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={cn(
                  "rounded-lg border border-[#E3E6EB] bg-white px-1.5 py-1",
                  {
                    "text-yellow-400": star <= (hoverRating || rating),
                    "text-[#606774]": star > (hoverRating || rating),
                  },
                )}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="w-full resize-none rounded-md border border-[#E3E6EB] p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[#FFFFFF]"
          />

          <button
            type="button"
            className="mt-3 w-full rounded-md bg-[#17191E] py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            평점 저장
          </button>
        </div>
      </section>
    </main>
  );
}
