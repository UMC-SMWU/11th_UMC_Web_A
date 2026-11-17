import { useState, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMemberRatings } from "../../api/movies/rating-api";
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tndb-image";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({
    from: "/movies/$movieId",
  });

  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  // 1. TMDB 영화 상세 정보 조회 (TanStack Query)
  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  // 2. 평점 관련 상태
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isRatingLoading, setIsRatingLoading] = useState(true);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [hasSavedRating, setHasSavedRating] = useState(false);

  // 3. NestJS 사용자 평점 조회 (기존 useEffect 유지)
  useEffect(() => {
    let ignore = false;

    async function loadRating() {
      setIsRatingLoading(true);
      setRatingError(null);
      setRating(0);
      setComment("");
      setHasSavedRating(false);

      try {
        const ratings = await getMemberRatings(1);

        const currentRating = ratings.find((item) => item.movieId === movieId);

        if (!ignore && currentRating) {
          setRating(currentRating.score);
          setComment(currentRating.comment ?? "");
          setHasSavedRating(true);
        }
      } catch (error) {
        if (!ignore) {
          setRatingError(
            error instanceof Error
              ? error.message
              : "평점을 불러오지 못했어요.",
          );
        }
      } finally {
        if (!ignore) {
          setIsRatingLoading(false);
        }
      }
    }

    if (isValidMovieId) {
      void loadRating();
    }

    return () => {
      ignore = true;
    };
  }, [movieId, isValidMovieId]);

  // 4. 즐겨찾기 상태 (Zustand 유지)
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  // 5. 예외 처리
  if (!isValidMovieId) {
    return <main>올바르지 않은 영화 번호예요.</main>;
  }

  if (movieDetailQuery.isPending) {
    return <main>영화 상세 정보를 불러오는 중이에요.</main>;
  }

  if (movieDetailQuery.isError) {
    return <main>{getMovieDetailErrorMessage(movieDetailQuery.error)}</main>;
  }

  // 영화 상세 데이터
  const movie = movieDetailQuery.data;

  return (
    <main>
      {/* 상단 영화 소개 영역 */}
      <section className="relative h-[360px] w-full overflow-hidden">
        {getTmdbBackdropUrl(movie.backdrop_path) ? (
          <img
            src={getTmdbBackdropUrl(movie.backdrop_path)!}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-600">
            이미지 없음
          </div>
        )}

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 mx-auto h-full max-w-[1248px] text-white">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="absolute top-6 flex items-center gap-1 text-[13px] font-bold leading-none"
          >
            <img
              src="/icons/chevron-left.svg"
              alt=""
              aria-hidden="true"
              className="h-5 w-5 brightness-0 invert"
            />
            <span>영화목록</span>
          </button>

          <div className="absolute bottom-7 left-0">
            <h1 className="text-[46px] font-bold leading-[49.68px] tracking-[-2.3px] text-white">
              {movie.title}
            </h1>

            <p className="mt-3 text-[16px]">{movie.original_title}</p>

            <div className="mt-3 flex items-center gap-2 text-[13px] font-weight">
              <span>{movie.release_date}</span>
              <span>{movie.genres.map((genre) => genre.name).join(", ")}</span>
              <span>
                {typeof movie.runtime === "number"
                  ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
                  : "상영 시간 정보가 없어요."}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 영화 상세 영역 */}
      <section className="mx-auto flex max-w-[1280px] gap-8 py-8">
        {/* 포스터 */}
        <div className="w-[200px] shrink-0">
          {getTmdbPosterUrl(movie.poster_path) ? (
            <img
              src={getTmdbPosterUrl(movie.poster_path)!}
              alt={`${movie.title} 포스터`}
              className="w-full rounded-xl object-cover"
            />
          ) : (
            <div className="flex aspect-[2/3] w-full items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500">
              이미지 없음
            </div>
          )}
        </div>

        {/* 영화 설명 */}
        <div className="flex-1">
          <h2 className="text-[24px] font-bold">{movie.tagline}</h2>

          <p className="mt-3 whitespace-pre-line text-[16px] leading-7 text-gray-600">
            {movie.overview}
          </p>

          <button
            type="button"
            onClick={() => toggleBookmark(movie.id)}
            className="mt-5 flex items-center gap-2 rounded-[12px] bg-[#4F64E8] px-[17px] py-[13px] font-bold text-white"
          >
            <img
              src={
                isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              alt=""
              aria-hidden="true"
              className="h-[17px] w-[17px] brightness-0 invert"
            />

            <span className="text-[17px] leading-none">
              {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
            </span>
          </button>
        </div>

        {/* 평점 영역 */}
        <aside className="w-[472px] shrink-0 border-l border-gray-200 pl-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-[21px] font-bold">내 평점</h2>

            <p className="mt-2 text-[12px] text-gray-400">
              별점은 필수, 후기는 선택이에요.
            </p>

            {isRatingLoading && (
              <p className="text-sm text-gray-500">평점을 불러오는 중이에요.</p>
            )}

            {ratingError && (
              <p className="text-sm text-red-500">{ratingError}</p>
            )}

            {!isRatingLoading && !ratingError && (
              <p className="text-sm text-gray-500">
                {hasSavedRating
                  ? "기존에 저장한 평점을 불러왔어요."
                  : "아직 등록된 평점이 없어요."}
              </p>
            )}

            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setRating(score)}
                  className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-white"
                >
                  <img
                    src={
                      score <= rating
                        ? "/icons/star.svg"
                        : "/icons/star-outline.svg"
                    }
                    alt={`${score}점`}
                    className="h-6 w-6"
                  />
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="영화를 보고 느낀 점을 남겨보세요."
              className="mt-3 h-[140px] w-full resize-none rounded-lg border border-gray-200 p-4 text-[14px] outline-none"
            />

            <button
              type="button"
              className="mt-3 w-full rounded-lg bg-[#19191D] py-3 font-bold text-white"
            >
              평점 저장
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
