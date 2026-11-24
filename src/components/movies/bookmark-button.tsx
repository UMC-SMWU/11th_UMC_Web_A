import { useRouter } from "next/navigation";
import { useFavoriteQuery, useFavoritesQuery, useToggleFavoriteMutation } from "../../hooks/use-favorites";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  // icon: 포스터 위에 올리는 아이콘 버튼, text: 아이콘과 문구가 함께 있는 버튼
  variant?: "icon" | "text";
  className?: string;
}

export function BookmarkButton({ movieId, variant = "icon", className }: BookmarkButtonProps) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  // 상세(text)는 영화 한 개를 조회하고, 목록(icon)은 즐겨찾기 목록 하나를 같이 써서 요청을 줄여요.
  const detailQuery = useFavoriteQuery(movieId, variant === "text");
  const listQuery = useFavoritesQuery(variant === "icon");
  const isBookmarked =
    variant === "text"
      ? Boolean(detailQuery.data)
      : Boolean(listQuery.data?.some((favorite) => favorite.movieId === movieId));
  const toggleMutation = useToggleFavoriteMutation(movieId);

  const toggleBookmark = () => {
    if (!accessToken) {
      alert("로그인 후 이용할 수 있어요.");
      router.push("/login");
      return;
    }
    if (toggleMutation.isPending) return;
    toggleMutation.mutate(isBookmarked);
  };

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
        onClick={toggleBookmark}
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
      onClick={toggleBookmark}
    >
      {/* 아이콘 버튼 배경이 어두워서, 검정색 outline 아이콘은 invert로 흰색으로 바꿔 보여 줘요. */}
      <img className={cn("size-[18px]", !isBookmarked && "invert")} src={iconSrc} alt="" />
    </button>
  );
}
