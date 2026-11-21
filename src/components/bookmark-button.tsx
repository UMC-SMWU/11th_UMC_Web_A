import { useNavigate } from "@tanstack/react-router";
import { useFavoriteQuery } from "@/hooks/use-favorite-query";
import { useCreateFavoriteMutation } from "@/hooks/use-create-favorite-mutation";
import { useDeleteFavoriteMutation } from "@/hooks/use-delete-favorite-mutation";
import { useAuthStore } from "@/stores/auth-store";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  // GET: 즐겨찾기 상태 확인
  const {
    data: favoriteData,
    isPending: isFavoritePending,
    isError: isFavoriteError,
  } = useFavoriteQuery(movieId);

  // POST: 즐겨찾기 등록
  const createFavoriteMutation = useCreateFavoriteMutation();

  // DELETE: 즐겨찾기 해제
  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  const isBookmarked = favoriteData?.result.isFavorite ?? false;

  const isMutating =
    createFavoriteMutation.isPending || deleteFavoriteMutation.isPending;

  const handleBookmarkClick = () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate({ to: "/login" });
      return;
    }

    if (isMutating || isFavoritePending || isFavoriteError) {
      return;
    }

    if (isBookmarked) {
      deleteFavoriteMutation.mutate(movieId, {
        onError: () => {
          alert("즐겨찾기 해제에 실패했어요.");
        },
      });
    } else {
      createFavoriteMutation.mutate(
        { movieId },
        {
          onError: () => {
            alert("즐겨찾기 등록에 실패했어요.");
          },
        },
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleBookmarkClick}
      disabled={
        isMutating ||
        (Boolean(accessToken) && (isFavoritePending || isFavoriteError))
      }
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white bg-black/60 text-xl text-white disabled:opacity-50"
      aria-label={isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 등록"}
      aria-pressed={isBookmarked}
    >
      <img
        className="h-7 w-7"
        src={
          isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"
        }
        alt=""
      />
    </button>
  );
}
