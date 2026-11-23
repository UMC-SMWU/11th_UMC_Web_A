import { useState } from "react";
import Link from "next/link";
import type { Rating } from "../../api/ratings/ratings";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useMemberId,
  useMyRatingsQuery,
  useUpdateRatingMutation,
} from "../../hooks/use-ratings";
import { cn } from "../../utils/cn";

const SCORES = [1, 2, 3, 4, 5];
const MAX_COMMENT_LENGTH = 500;

const sectionClass = "mt-8 max-w-[640px] rounded-[10px] bg-white/10 p-5";
const primaryButtonClass =
  "h-10 shrink-0 whitespace-nowrap rounded-lg bg-primary px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/50";
const outlineButtonClass =
  "h-10 shrink-0 whitespace-nowrap rounded-lg border border-white/40 px-4 text-sm font-bold text-white disabled:opacity-50";

export function RatingSection({ movieId }: { movieId: number }) {
  const memberId = useMemberId();
  const myRatingsQuery = useMyRatingsQuery();
  const deleteRatingMutation = useDeleteRatingMutation();
  const [isEditing, setIsEditing] = useState(false);

  if (memberId === null) {
    return (
      <section className={sectionClass}>
        <p className="text-sm text-white/80">
          로그인하면 평점을 남길 수 있어요.{" "}
          <Link href="/login" className="font-bold text-white underline">
            로그인
          </Link>
        </p>
      </section>
    );
  }

  if (myRatingsQuery.isLoading) {
    return (
      <section className={sectionClass}>
        <p className="text-sm text-white/80">내 평점을 불러오는 중이에요.</p>
      </section>
    );
  }

  if (myRatingsQuery.isError) {
    return (
      <section className={sectionClass}>
        <p className="text-sm text-white/80">내 평점을 불러오지 못했어요.</p>
      </section>
    );
  }

  const myRating = myRatingsQuery.data?.find((rating) => rating.movieId === movieId);

  // 평점이 없으면 등록 폼, 수정 중이면 수정 폼
  if (!myRating || isEditing) {
    return (
      <section className={sectionClass}>
        <h2 className="mb-3 text-base font-bold">
          {myRating ? "평점 수정" : "평점 남기기"}
        </h2>
        <RatingForm
          movieId={movieId}
          initialRating={myRating}
          onDone={() => setIsEditing(false)}
        />
      </section>
    );
  }

  const handleDelete = () => {
    if (deleteRatingMutation.isPending) return;
    if (!confirm("평점을 삭제할까요?")) return;
    deleteRatingMutation.mutate(myRating.ratingId);
  };

  return (
    <section className={sectionClass}>
      <h2 className="mb-3 text-base font-bold">내 평점</h2>
      <p className="text-2xl text-yellow-400" aria-label={`${myRating.score}점`}>
        {"★".repeat(myRating.score)}
        <span className="text-white/30">{"★".repeat(5 - myRating.score)}</span>
      </p>
      <p className="mt-2 text-sm whitespace-pre-wrap text-white/90">
        {myRating.comment ?? "작성한 후기가 없어요."}
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className={outlineButtonClass}
        >
          수정
        </button>
        <button
          type="button"
          disabled={deleteRatingMutation.isPending}
          onClick={handleDelete}
          className={outlineButtonClass}
        >
          {deleteRatingMutation.isPending ? "삭제 중" : "삭제"}
        </button>
      </div>
    </section>
  );
}

interface RatingFormProps {
  movieId: number;
  initialRating?: Rating;
  onDone: () => void;
}

function RatingForm({ movieId, initialRating, onDone }: RatingFormProps) {
  const [score, setScore] = useState(initialRating?.score ?? 0);
  const [comment, setComment] = useState(initialRating?.comment ?? "");
  const createRatingMutation = useCreateRatingMutation();
  const updateRatingMutation = useUpdateRatingMutation();

  const isPending = createRatingMutation.isPending || updateRatingMutation.isPending;
  const canSubmit = score >= 1 && score <= 5 && !isPending;

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    // 빈 후기는 보내지 않음 (서버에 null로 저장)
    const body = { score, comment: comment.trim() || undefined };

    if (initialRating) {
      updateRatingMutation.mutate(
        { ratingId: initialRating.ratingId, ...body },
        { onSuccess: onDone },
      );
    } else {
      createRatingMutation.mutate({ movieId, ...body });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex gap-1">
        {SCORES.map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`${value}점`}
            aria-pressed={score === value}
            disabled={isPending}
            onClick={() => setScore(value)}
            className={cn(
              "text-3xl leading-none transition",
              score >= value ? "text-yellow-400" : "text-white/30 hover:text-white/60",
            )}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        maxLength={MAX_COMMENT_LENGTH}
        disabled={isPending}
        placeholder="후기를 남겨 주세요 (선택)"
        onChange={(event) => setComment(event.target.value)}
        className="mt-3 h-24 w-full resize-none rounded-lg border border-white/20 bg-black/30 p-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/60"
      />
      <p className="mt-1 text-right text-xs text-white/60">
        {comment.length}/{MAX_COMMENT_LENGTH}
      </p>

      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={!canSubmit} className={primaryButtonClass}>
          {isPending ? "저장 중" : initialRating ? "수정 완료" : "등록"}
        </button>
        {initialRating && (
          <button
            type="button"
            disabled={isPending}
            onClick={onDone}
            className={outlineButtonClass}
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
}