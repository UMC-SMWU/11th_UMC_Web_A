import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMemberRatings } from "../../api/movies/rating-api";
import { useRatingMutations } from "../../hook/use-rating-mutations";
import { BookmarkButton } from "../../components/bookmark-button";

import type { Rating } from "../../types/rating";

import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tndb-image";

import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

// 임시 회원 ID: 추후 로그인한 회원의 실제 ID로 교체해야 함
const TEMP_MEMBER_ID = 1;

interface RatingEditorProps {
  movieId: number;
  savedRating?: Rating;
}

function RatingEditor({ movieId, savedRating }: RatingEditorProps) {
  const [rating, setRating] = useState(savedRating?.score ?? 0);
  const [comment, setComment] = useState(savedRating?.comment ?? "");

  const { createMutation, updateMutation, deleteMutation } =
    useRatingMutations();

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const mutationError =
    createMutation.error ?? updateMutation.error ?? deleteMutation.error;

  // 평점 등록 또는 수정
  const handleSaveRating = () => {
    if (isSaving) return;

    if (rating === 0) {
      alert("별점을 선택해 주세요.");
      return;
    }

    if (savedRating) {
      // 기존 평점 수정
      updateMutation.mutate({
        ratingId: savedRating.ratingId,
        score: rating,
        comment,
      });
    } else {
      // 새로운 평점 등록
      createMutation.mutate({
        movieId,
        score: rating,
        comment,
      });
    }
  };

  // 평점 삭제
  const handleDeleteRating = () => {
    if (!savedRating || isSaving) return;

    const confirmed = window.confirm("등록한 평점을 삭제하시겠습니까?");

    if (!confirmed) return;

    deleteMutation.mutate(savedRating.ratingId);
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-[21px] font-bold">내 평점</h2>

      <p className="mt-2 text-[12px] text-gray-400">
        별점은 필수, 후기는 선택이에요.
      </p>

      <p className="text-sm text-gray-500">
        {savedRating
          ? "기존에 저장한 평점을 불러왔어요."
          : "아직 등록된 평점이 없어요."}
      </p>

      {/* 별점 선택 */}
      <div className="mt-3 flex gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => setRating(score)}
            disabled={isSaving}
            aria-label={`${score}점`}
            aria-pressed={rating === score}
            className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-white"
          >
            <img
              src={
                score <= rating ? "/icons/star.svg" : "/icons/star-outline.svg"
              }
              alt=""
              className="h-6 w-6"
            />
          </button>
        ))}
      </div>

      {/* 후기 입력 */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={isSaving}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        className="mt-3 h-[140px] w-full resize-none rounded-lg border border-gray-200 p-4 text-[14px] outline-none"
      />

      {mutationError && (
        <p className="text-sm text-red-500">
          {mutationError instanceof Error
            ? mutationError.message
            : "평점 처리 중 오류가 발생했어요."}
        </p>
      )}

      {/* 등록 / 수정 버튼 */}
      <button
        type="button"
        onClick={handleSaveRating}
        disabled={isSaving || rating === 0}
        className="mt-3 w-full rounded-lg bg-[#19191D] py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? "처리 중..." : savedRating ? "평점 수정" : "평점 저장"}
      </button>

      {/* 기존 평점이 있을 때만 삭제 표시 */}
      {savedRating && (
        <button
          type="button"
          onClick={handleDeleteRating}
          disabled={isSaving}
          className="mt-2 w-full rounded-lg border border-red-300 py-3 font-bold text-red-500 disabled:opacity-50"
        >
          평점 삭제
        </button>
      )}
    </div>
  );
}

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({
    from: "/movies/$movieId",
  });

  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  // 1. TMDB 영화 상세 조회
  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  // 2. 회원 평점 조회
  const ratingsQuery = useQuery({
    queryKey: ["ratings", "member", TEMP_MEMBER_ID],
    queryFn: () => getMemberRatings(TEMP_MEMBER_ID),
    enabled: isValidMovieId,
    retry: false,
  });

  // 3. 현재 영화의 평점 찾기
  const savedRating = ratingsQuery.data?.find(
    (item) => item.movieId === movieId,
  );

  if (!isValidMovieId) {
    return <main>올바르지 않은 영화 번호예요.</main>;
  }

  if (movieDetailQuery.isPending) {
    return <main>영화 상세 정보를 불러오는 중이에요.</main>;
  }

  if (movieDetailQuery.isError) {
    return <main>{getMovieDetailErrorMessage(movieDetailQuery.error)}</main>;
  }

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

            <div className="mt-3 flex items-center gap-2 text-[13px]">
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

          {/* API 기반 즐겨찾기 버튼 */}
          <BookmarkButton movieId={movie.id} variant="detail" />
        </div>

        {/* 평점 영역 */}
        <aside className="w-[472px] shrink-0 border-l border-gray-200 pl-8">
          {ratingsQuery.isPending ? (
            <p className="text-sm text-gray-500">평점을 불러오는 중이에요.</p>
          ) : ratingsQuery.isError ? (
            <p className="text-sm text-red-500">평점을 불러오지 못했어요.</p>
          ) : (
            <RatingEditor
              key={`${movieId}-${savedRating?.ratingId ?? "new"}-${savedRating?.updatedAt ?? ""}`}
              movieId={movieId}
              savedRating={savedRating}
            />
          )}
        </aside>
      </section>
    </main>
  );
}
