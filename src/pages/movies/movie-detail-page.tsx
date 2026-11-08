import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

function formatRuntime(runtime: number | null) {
  if (typeof runtime !== "number") return "상영 시간 정보가 없어요.";
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId, // 유효한 번호일 때만 요청
  });

  // 훅은 모두 조기 return보다 위에서 호출
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  // 1. 잘못된 영화 번호 (enabled가 false여도 isPending이 true라서 가장 먼저 처리)
  if (!isValidMovieId) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-[#999999]">올바르지 않은 영화 번호예요.</p>
      </main>
    );
  }

  // 2. 로딩
  if (movieDetailQuery.isPending) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-[#999999]">영화 상세 정보를 불러오는 중이에요.</p>
      </main>
    );
  }

  // 3. 오류 (404면 "영화를 찾을 수 없어요.")
  if (movieDetailQuery.isError) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-[#999999]">
          {getMovieDetailErrorMessage(movieDetailQuery.error)}
        </p>
      </main>
    );
  }

  // 4. 성공
  const movie = movieDetailQuery.data;
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <main>
      {/* 배경 이미지 + 타이틀 오버레이 */}
      <div className="relative h-80 w-full overflow-hidden bg-[#e5e5e5]">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[#999999]">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <Link
          to="/"
          className="absolute left-10 top-6 flex items-center gap-1 text-sm text-white/80 hover:text-white"
        >
          <span aria-hidden="true">‹</span> 영화 목록
        </Link>

        <div className="absolute bottom-6 left-10 right-10 text-white">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="mt-1 text-sm text-white/80">{movie.original_title}</p>
          <p className="mt-1 text-sm text-white/80">
            {movie.release_date.replaceAll("-", ".")} &nbsp;
            {movie.genres.map((genre) => genre.name).join(", ")} &nbsp;
            {formatRuntime(movie.runtime)}
          </p>
        </div>
      </div>

      {/* 포스터 + 줄거리 */}
      <div className="flex flex-col gap-10 px-10 py-10 lg:flex-row">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} 포스터`}
            className="w-40 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex aspect-[2/3] w-40 shrink-0 items-center justify-center rounded-lg bg-[#e5e5e5] text-sm text-[#999999]">
            이미지 없음
          </div>
        )}

        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#111111]">{movie.tagline}</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#333333]">
            {movie.overview}
          </p>
          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => toggleBookmark(movie.id)}
            className={cn(
              "mt-4 rounded-md px-4 py-2 text-sm font-semibold text-white",
              isBookmarked ? "bg-[#111111]" : "bg-blue-600",
            )}
          >
            {isBookmarked ? "🔖 즐겨찾기 해제" : "🔖 즐겨찾기"}
          </button>
        </div>
      </div>
    </main>
  );
}