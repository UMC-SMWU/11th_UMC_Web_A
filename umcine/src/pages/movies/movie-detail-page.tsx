import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react"; // ✅ 추가: 요청 결과를 state에 담고, Effect로 요청
import { getMovieDetail } from "../../api/movies/get-movie-detail"; // ✅ 추가: TMDB 상세 요청 함수
import type { TmdbMovieDetail } from "../../api/movies/models"; // ✅ 추가: 상세 응답 타입
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image"; // ✅ 추가: 이미지 주소 만들기
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message"; // ✅ 추가: 404 구분
import { BookmarkButton } from "../../components/bookmark-button";

function formatRuntime(runtime: number | null) {
  if (!runtime) return "상영 시간 정보가 없어요.";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;
  // 요청할 ID (올바르지 않으면 null)
  const requestMovieId = isValidMovieId ? parsedMovieId : null;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(requestMovieId !== null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [prevMovieId, setPrevMovieId] = useState(requestMovieId);
  if (requestMovieId !== prevMovieId) {
    setPrevMovieId(requestMovieId);
    setMovie(null);
    setErrorMessage(null);
    setIsLoading(requestMovieId !== null);
  }

  //영화 ID가  바뀔 때마다 TMDB에 상세 정보 요청
  useEffect(() => {
    if (requestMovieId === null) return; // 올바르지 않은 번호면 요청 안 함

    let ignore = false;

    getMovieDetail(requestMovieId)
      .then((response) => {
        if (!ignore) setMovie(response);
      })
      .catch((error) => {
        // 404면 "영화를 찾을 수 없어요.", 나머지는 "불러오지 못했어요."
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [requestMovieId]);

  // 번호 오류, 로딩, 에러 상태를 순서대로 추가
  if (!isValidMovieId) {
    return (
      <main className="px-20 py-20 text-center text-sub">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="px-20 py-20 text-center text-sub">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="px-20 py-20 text-center text-sub">{errorMessage}</main>
    );
  }

  if (!movie) {
    return (
      <main className="px-20 py-20 text-center text-sub">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  // 이미지 주소 만들기 (없으면 null)
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  // 개봉일 · 장르 · 상영 시간 한 줄 만들기
  const metaText = [
    movie.release_date,
    movie.genres.map((genre) => genre.name).join(", "),
    formatRuntime(movie.runtime),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
      <main className="relative min-h-[calc(100vh-148px)] overflow-hidden">
      {backdropUrl ? (
        <img
          src={backdropUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-end justify-end bg-canvas p-6 text-sm text-sub">
          이미지 없음
        </div>
      )}
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative flex flex-col gap-8 px-20 py-10 text-white">
        <Link to="/" className="w-fit text-sm font-bold text-white/80 hover:text-white">
          ← 영화 목록
        </Link>

        <div className="flex gap-10">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="h-[420px] w-[280px] shrink-0 rounded-[10px] object-cover"
            />
          ) : (
            <div className="flex h-[420px] w-[280px] shrink-0 items-center justify-center rounded-[10px] bg-canvas text-sm text-sub">
              이미지 없음
            </div>
          )}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-black">{movie.title}</h1>
              <BookmarkButton movieId={movie.id} movieTitle={movie.title} />
            </div>
            <p className="text-lg text-white/70">{movie.original_title}</p>
            <p className="text-sm text-white/70">{metaText}</p>
            {movie.tagline && (
              <h2 className="mt-6 text-xl font-bold">{movie.tagline}</h2>
            )}
            <p className="max-w-[640px] leading-7 text-white/90">{movie.overview}</p>
          </div>
        </div>
      </div>
    </main>
  );
}