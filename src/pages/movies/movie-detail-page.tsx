import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { StatusMessage } from "../../components/common/status-message";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { MoviePoster } from "../../components/movies/movie-poster";
import { formatReleaseDate, formatRuntime } from "../../utils/movies/format-movie";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl } from "../../utils/movies/tmdb-image";

function DetailMessage({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-start gap-4 px-5 py-10 md:px-20">
      {children}
      <Link to="/" className="text-sm font-bold text-brand hover:text-brand-hover">
        영화 목록
      </Link>
    </main>
  );
}

interface MovieDetailContentProps {
  movieId: number;
}

function MovieDetailContent({ movieId }: MovieDetailContentProps) {
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // "다시 시도"를 누르면 값이 바뀌어서 같은 영화를 다시 요청해요.
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // 영화가 바뀌면 이 컴포넌트가 정리되면서 이전 응답은 무시돼요.
    let ignore = false;

    getMovieDetail(movieId)
      .then((response) => {
        if (!ignore) setMovie(response);
      })
      .catch((error: unknown) => {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [movieId, retryCount]);

  function handleRetry() {
    setIsLoading(true);
    setErrorMessage(null);
    setRetryCount((count) => count + 1);
  }

  // 로딩 -> 오류 -> 성공 순서로 화면을 구분해요.
  if (isLoading) {
    return (
      <DetailMessage>
        <StatusMessage className="items-start py-0 text-left">
          영화 정보를 불러오는 중이에요.
        </StatusMessage>
      </DetailMessage>
    );
  }

  if (errorMessage || !movie) {
    return (
      <DetailMessage>
        <StatusMessage tone="error" className="items-start py-0 text-left" onRetry={handleRetry}>
          {errorMessage ?? "영화 정보를 불러오지 못했어요."}
        </StatusMessage>
      </DetailMessage>
    );
  }

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  return (
    <main className="relative isolate flex-1 overflow-hidden bg-ink text-white">
      {backdropUrl ? (
        <img
          className="absolute inset-0 -z-20 size-full object-cover"
          src={backdropUrl}
          alt=""
          aria-hidden="true"
        />
      ) : null}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink via-ink/75 to-ink/30" />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 py-8 md:flex-row md:gap-12 md:px-20 md:py-14">
        <div className="flex shrink-0 flex-col items-start gap-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white"
          >
            <img className="size-5 invert" src="/icons/chevron-left.svg" alt="" />
            영화 목록
          </Link>
          <MoviePoster
            posterPath={movie.poster_path}
            title={movie.title}
            className="aspect-[2/3] w-[220px] rounded-[10px] shadow-2xl md:w-[300px]"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 md:pt-12">
          <h1 className="text-[32px] leading-tight font-bold tracking-tight md:text-[44px]">
            {movie.title}
          </h1>
          <p className="text-base text-white/70">{movie.original_title}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/80">
            <p>{formatReleaseDate(movie.release_date)}</p>
            {movie.genres.length > 0 ? (
              <p>{movie.genres.map((genre) => genre.name).join(", ")}</p>
            ) : null}
            <p>{formatRuntime(movie.runtime)}</p>
          </div>
          {movie.tagline ? <h2 className="mt-6 text-xl font-bold">{movie.tagline}</h2> : null}
          <p className="max-w-[640px] text-base leading-7 text-white/85">
            {movie.overview || "줄거리 정보가 없어요."}
          </p>
          <BookmarkButton movieId={movie.id} variant="text" className="mt-4 self-start" />
        </div>
      </div>
    </main>
  );
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  // URL의 movieId는 문자열이라 숫자로 바꾸고, 양의 정수일 때만 요청해요.
  const parsedMovieId = Number(movieId);

  if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
    return (
      <DetailMessage>
        <StatusMessage tone="error" className="items-start py-0 text-left">
          올바르지 않은 영화 번호예요.
        </StatusMessage>
      </DetailMessage>
    );
  }

  // key가 바뀌면 상태가 새로 시작돼서 이전 영화 정보가 잠깐 보이지 않아요.
  return <MovieDetailContent key={parsedMovieId} movieId={parsedMovieId} />;
}
