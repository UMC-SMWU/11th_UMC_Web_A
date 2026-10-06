import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  // icon: 포스터 위에 올리는 아이콘 버튼, text: 아이콘과 문구가 함께 있는 버튼
  variant?: "icon" | "text";
  className?: string;
}

export function BookmarkButton({ movieId, variant = "icon", className }: BookmarkButtonProps) {
  // store에서 필요한 값만 골라 써서, 다른 영화의 북마크가 바뀌어도 이 버튼은 다시 그리지 않아요.
  const isBookmarked = useBookmarkStore((state) => state.bookmarkedMovieIds.includes(movieId));
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const label = isBookmarked ? "북마크 해제" : "북마크 추가";
  const iconSrc = isBookmarked ? "/icons/bookmark-filled.svg" : "/icons/bookmark-outline.svg";

  if (variant === "text") {
    return (
      <button
        type="button"
        className={cn(
          "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-sm font-bold text-ink transition hover:border-brand hover:text-brand active:scale-95",
          isBookmarked && "border-brand text-brand",
          className,
        )}
        aria-pressed={isBookmarked}
        onClick={() => toggleBookmark(movieId)}
      >
        <img className="size-4" src={iconSrc} alt="" />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "flex size-[34px] cursor-pointer items-center justify-center rounded-lg border border-white bg-ink/45 px-1.5 py-[7.5px] transition hover:bg-ink/65 active:scale-95",
        className,
      )}
      aria-pressed={isBookmarked}
      aria-label={label}
      onClick={() => toggleBookmark(movieId)}
    >
      <img className="size-[18px]" src={iconSrc} alt="" />
    </button>
  );
}
