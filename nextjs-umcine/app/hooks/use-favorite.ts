"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { addFavorite } from "../api/favorites/add-favorite";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import { removeFavorite } from "../api/favorites/remove-favorite";
import { useAuthStore } from "../stores/auth-store";
import { favoriteKeys } from "../api/favorites/favorite-keys";

export function useFavorite(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;
  const detailKey = favoriteKeys.detail(movieId);

  const statusQuery = useQuery({
    queryKey: detailKey,
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken) && isValidMovieId,
    retry: false,
  });

  const handleSuccess = (isFavorite: boolean) => {
    // 단건은 결과를 알고 있으니 직접 교체
    queryClient.setQueryData<boolean>(detailKey, isFavorite);
    // 목록은 서버가 정렬과 포함 여부를 정하니 다시 조회
    queryClient.invalidateQueries({ queryKey: favoriteKeys.list });
  };

  const addMutation = useMutation({
    mutationFn: () => addFavorite(movieId),
    onSuccess: () => handleSuccess(true),
    onError: () => alert("즐겨찾기 추가에 실패했어요. 다시 시도해 주세요."),
  });

  const removeMutation = useMutation({
    mutationFn: () => removeFavorite(movieId),
    onSuccess: () => handleSuccess(false),
    onError: () => alert("즐겨찾기 해제에 실패했어요. 다시 시도해 주세요."),
  });

  const isFavorite = statusQuery.data ?? false;
  const isPending = addMutation.isPending || removeMutation.isPending;

  const toggle = () => {
    if (isPending) return;
    if (isFavorite) removeMutation.mutate();
    else addMutation.mutate();
  };

  return { isFavorite, isPending, toggle, isLoggedIn: Boolean(accessToken) };
}
