"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import Link from "next/link";
import { useMovieRating } from "../../hooks/use-movie-rating";
import { cn } from "../../utils/cn";

const MAX_SCORE = 5;

export function RatingPanel({ movieId }: { movieId: number }) {
  const rating = useMovieRating(movieId);

  return (
    <section className="w-full lg:w-80 lg:border-l lg:border-[#e5e7eb] lg:pl-10">
      <h2 className="text-xl font-bold text-[#111111]">내 평점</h2>

      {!rating.isLoggedIn ? (
        <p className="mt-3 text-sm text-[#6b7280]">
          로그인하면 평점을 남길 수 있어요.{" "}
          <Link href="/login" className="font-bold text-blue-600">
            로그인
          </Link>
        </p>
      ) : rating.isError ? (
        <p className="mt-3 text-sm text-[#999999]">평점을 불러오지 못했어요.</p>
      ) : rating.isLoading ? (
        <p className="mt-3 text-sm text-[#999999]">평점을 불러오는 중이에요.</p>
      ) : (
        // 평점이 생기거나 사라지면 폼을 새로 만들어 초기값을 맞춤
        <RatingForm
          key={rating.current?.ratingId ?? "new"}
          movieId={movieId}
          rating={rating}
        />
      )}
    </section>
  );
}

function RatingForm({
  movieId,
  rating,
}: {
  movieId: number;
  rating: ReturnType<typeof useMovieRating>;
}) {
  const current = rating.current;
  const [score, setScore] = useState(current?.score ?? 0);
  const [content, setContent] = useState(current?.content ?? "");

  const canSubmit = score >= 1 && !rating.isMutating;

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    if (current) {
      rating.update({
        ratingId: current.ratingId,
        score,
        content: content.trim(),
      });
    } else {
      rating.create({ movieId, score, content: content.trim() });
    }
  };

  const handleDelete = () => {
    if (!current || rating.isMutating) return;
    if (!window.confirm("평점을 삭제할까요?")) return;
    rating.remove(current.ratingId);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-2 flex flex-col gap-3">
      <p className="text-xs text-[#9ca3af]">별점은 필수, 후기는 선택이에요.</p>

      <div className="flex gap-1" role="radiogroup" aria-label="별점">
        {Array.from({ length: MAX_SCORE }, (_, i) => i + 1).map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={value === score}
            aria-label={`${value}점`}
            onClick={() => setScore(value)}
            className={cn(
              "h-9 w-9 cursor-pointer rounded-lg border text-lg",
              value <= score
                ? "border-[#111111] text-[#111111]"
                : "border-[#e5e7eb] text-[#d1d5db]",
            )}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        rows={4}
        className="w-full resize-none rounded-xl border border-[#e5e7eb] bg-white p-3 text-sm outline-none focus:border-blue-600"
      />

      <button
        type="submit"
        disabled={!canSubmit}
        className="h-11 cursor-pointer rounded-lg bg-[#111111] text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {rating.isMutating ? "저장 중" : current ? "평점 수정" : "평점 저장"}
      </button>

      {current && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={rating.isMutating}
          className="text-sm font-bold text-red-600 disabled:opacity-40"
        >
          평점 삭제
        </button>
      )}
    </form>
  );
}