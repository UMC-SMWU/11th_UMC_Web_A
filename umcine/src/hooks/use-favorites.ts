import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite,
  getFavorites,
  getFavoriteStatus,
  removeFavorite,
  type Favorite,
  type FavoriteStatus,
} from "../api/favorites/favorites";
import { useAuthStore } from "../stores/auth-store";

export const favoriteKeys = {
  all: ["favorites"] as const,
  list: ["favorites", "list"] as const,
  status: (movieId: number) => ["favorites", "status", movieId] as const,
};

export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: favoriteKeys.list,
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    retry: false,
  });
}

// 영화 카드용: 목록 하나를 모든 카드가 같이 씀 (요청은 1번)
export function useIsInFavorites(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const favoritesQuery = useFavoritesQuery();

  return (
    Boolean(accessToken) &&
    (favoritesQuery.data?.some((favorite) => favorite.movieId === movieId) ?? false)
  );
}

// 영화 상세용
export function useFavoriteStatusQuery(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: favoriteKeys.status(movieId),
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken) && Number.isInteger(movieId) && movieId > 0,
    retry: false,
  });
}

interface ToggleFavoriteVariables {
  movieId: number;
  isFavorite: boolean; // 누르기 전 상태
}

export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ movieId, isFavorite }: ToggleFavoriteVariables) => {
      if (isFavorite) {
        await removeFavorite(movieId);
        return null;
      }
      const response = await addFavorite(movieId);
      return response.result;
    },
    onSuccess: (favorite, { movieId, isFavorite }) => {
      // 상세 화면의 여부 캐시를 바로 바꿈
      queryClient.setQueryData<FavoriteStatus>(favoriteKeys.status(movieId), {
        isFavorite: !isFavorite,
      });
      // 목록 캐시에 추가하거나 제거 (목록을 아직 조회하지 않았다면 그대로 둠)
      queryClient.setQueryData<Favorite[]>(favoriteKeys.list, (prev) => {
        if (!prev) return prev;
        if (favorite) return [favorite, ...prev];
        return prev.filter((item) => item.movieId !== movieId);
      });
    },
    onError: () => {
      // 이미 등록됨(409), 이미 해제됨(404)처럼 캐시가 서버와 어긋났을 수 있어 다시 조회
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
      alert("즐겨찾기 변경에 실패했어요. 다시 시도해 주세요.");
    },
  });
}