import { useFavorite } from "../hook/use-favorite";
import { useAuthStore } from "../stores/auth-store";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "card" | "search" | "detail";
}

export function BookmarkButton({
  movieId,
  variant = "card",
}: BookmarkButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const { isBookmarked, isPending, isLoading, isError, toggleBookmark } =
    useFavorite(movieId);

  const handleClick = () => {
    if (!accessToken) {
      alert("로그인이 필요해요.");
      return;
    }

    toggleBookmark();
  };

  const iconSrc = isBookmarked
    ? "/icons/bookmark.svg"
    : "/icons/bookmark-outline.svg";

  if (variant === "card") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending || (Boolean(accessToken) && (isLoading || isError))}
        aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
        aria-pressed={isBookmarked}
        className={`absolute right-3 top-3 flex h-[34px] w-[34px] items-center justify-center rounded-lg ${
          isBookmarked ? "bg-blue-600" : "border border-white bg-[#17191e]"
        } disabled:opacity-50`}
      >
        <img src={iconSrc} alt="" className="h-6 w-6 brightness-0 invert" />
      </button>
    );
  }

  if (variant === "detail") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending || (Boolean(accessToken) && (isLoading || isError))}
        className="mt-5 flex items-center gap-2 rounded-[12px] bg-[#4F64E8] px-[17px] py-[13px] font-bold text-white disabled:opacity-50"
      >
        <img
          src={iconSrc}
          alt=""
          className="h-[17px] w-[17px] brightness-0 invert"
        />

        <span className="text-[17px] leading-none">
          {isPending ? "처리 중" : isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending || (Boolean(accessToken) && (isLoading || isError))}
      className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm disabled:opacity-50"
    >
      {isPending ? "처리 중" : isBookmarked ? "북마크 해제" : "북마크 추가"}
    </button>
  );
}
