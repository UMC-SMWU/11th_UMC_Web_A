import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, getFavorite, getFavorites, removeFavorite } from "../api/favorites/favorites";
import { useAuthStore } from "../stores/auth-store";

export function useFavoritesQuery(enabled = true) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: enabled && Boolean(accessToken),
    retry: false,
  });
}

export function useFavoriteQuery(movieId: number, enabled = true) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavorite(movieId),
    enabled: enabled && Boolean(accessToken),
    retry: false,
  });
}

// 추가/해제 모두 서버 응답에 바뀐 목록이 없어서, 즐겨찾기 관련 캐시를 무효화해 다시 조회해요.
export function useToggleFavoriteMutation(movieId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    // 추가와 해제의 응답 형태가 달라서, 결과를 쓰지 않고 요청이 끝나기만 기다려요.
    mutationFn: async (isFavorite: boolean) => {
      if (isFavorite) {
        await removeFavorite(movieId);
      } else {
        await addFavorite(movieId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => {
      alert("즐겨찾기를 바꾸지 못했어요. 다시 시도해 주세요.");
    },
  });
}
