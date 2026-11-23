import { useRouter } from "next/navigation";
import { useToggleFavoriteMutation } from "../hooks/use-favorites";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  isBookmarked: boolean;
  className?: string;
}

export function BookmarkButton({
  movieId,
  movieTitle,
  isBookmarked,
  className,
}: BookmarkButtonProps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const toggleFavoriteMutation = useToggleFavoriteMutation();

  const handleClick = () => {
    if (!accessToken) {
      alert("로그인 후 즐겨찾기할 수 있어요.");
      router.push("/login");
      return;
    }
    if (toggleFavoriteMutation.isPending) return;

    toggleFavoriteMutation.mutate({ movieId, isFavorite: isBookmarked });
  };

  return (
    <button
      type="button"
      aria-pressed={isBookmarked}
      aria-label={
        isBookmarked ? `${movieTitle} 북마크 해제` : `${movieTitle} 북마크 추가`
      }
      disabled={toggleFavoriteMutation.isPending}
      onClick={handleClick}
      className={cn(
        "flex size-9 items-center justify-center rounded-lg disabled:opacity-60",
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