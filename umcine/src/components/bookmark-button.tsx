import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  className?: string;
}

export function BookmarkButton({
  movieId,
  movieTitle,
  className,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      aria-pressed={isBookmarked}
      aria-label={
        isBookmarked ? `${movieTitle} 북마크 해제` : `${movieTitle} 북마크 추가`
      }
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "flex size-9 items-center justify-center rounded-lg",
        isBookmarked ? "bg-primary" : "border border-line bg-white",
        className,
      )}
    >
      <img
        src={
          isBookmarked
            ? "/icons/movie-icons/bookmark.svg"
            : "/icons/movie-icons/bookmark-outline.svg"
        }
        alt=""
        aria-hidden="true"
        className="size-5"
      />
    </button>
  );
}