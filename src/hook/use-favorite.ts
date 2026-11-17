import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavorite } from "../api/favorites/get-favorite";
import { addFavorite } from "../api/favorites/add-favorite";
import { deleteFavorite } from "../api/favorites/delete-favorite";
import { useAuthStore } from "../stores/auth-store";

export function useFavorite(movieId: number) {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  // 즐겨찾기 상태 조회
  const favoriteQuery = useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavorite(movieId),
    enabled: Boolean(accessToken),
    retry: false,
  });

  // 즐겨찾기 등록
  const addMutation = useMutation({
    mutationFn: () => addFavorite(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  // 즐겨찾기 삭제
  const deleteMutation = useMutation({
    mutationFn: () => deleteFavorite(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });

  const isBookmarked = favoriteQuery.data ?? false;

  const isPending = addMutation.isPending || deleteMutation.isPending;

  const toggleBookmark = () => {
    if (isPending || !accessToken || !favoriteQuery.isSuccess) return;

    if (isBookmarked) {
      deleteMutation.mutate();
    } else {
      addMutation.mutate();
    }
  };

  return {
    isBookmarked,
    isPending,
    isLoading: favoriteQuery.isLoading,
    isError:
      favoriteQuery.isError || addMutation.isError || deleteMutation.isError,
    toggleBookmark,
  };
}
