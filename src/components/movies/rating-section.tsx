import { useState, type SubmitEvent } from "react";
import { useMyRatingsQuery, useRatingMutations } from "../../hooks/use-ratings";

const SCORES = [1, 2, 3, 4, 5];

export function RatingSection({ movieId }: { movieId: number }) {
  const ratingsQuery = useMyRatingsQuery();
  const { create, update, remove } = useRatingMutations();
  const myRating = ratingsQuery.data?.find((rating) => rating.movieId === movieId);

  // null이면 서버에 저장된 값을 보여 주고, 입력을 시작하면 입력값을 써요.
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState<string | null>(null);
  const currentScore = score ?? myRating?.score ?? 5;
  const currentComment = comment ?? myRating?.comment ?? "";
  const isPending = create.isPending || update.isPending || remove.isPending;

  const resetInput = () => {
    setScore(null);
    setComment(null);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isPending) return;
    const body = { score: currentScore, comment: currentComment.trim() || undefined };

    if (myRating) {
      update.mutate({ ratingId: myRating.ratingId, ...body }, { onSuccess: resetInput });
    } else {
      create.mutate({ movieId, ...body }, { onSuccess: resetInput });
    }
  };

  const handleDelete = () => {
    if (!myRating || isPending) return;
    remove.mutate(myRating.ratingId, { onSuccess: resetInput });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex max-w-[640px] flex-col gap-3">
      <h2 className="text-xl font-bold">내 평점</h2>
      <div className="flex items-center gap-2">
        {SCORES.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={currentScore === value}
            className={`size-9 cursor-pointer rounded-lg border text-sm font-bold ${
              currentScore === value
                ? "border-brand bg-brand text-white"
                : "border-white/40 text-white/80 hover:border-white"
            }`}
            onClick={() => setScore(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <textarea
        className="h-24 rounded-lg border border-white/40 bg-white/10 p-3 text-sm text-white placeholder:text-white/50"
        placeholder="한 줄 후기를 남겨 주세요. (500자 이하)"
        maxLength={500}
        value={currentComment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="h-10 cursor-pointer rounded-lg bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover disabled:opacity-50"
        >
          {myRating ? "평점 수정" : "평점 등록"}
        </button>
        {myRating ? (
          <button
            type="button"
            disabled={isPending}
            className="h-10 cursor-pointer rounded-lg border border-white/40 px-5 text-sm font-bold text-white hover:border-white disabled:opacity-50"
            onClick={handleDelete}
          >
            삭제
          </button>
        ) : null}
      </div>
    </form>
  );
}
