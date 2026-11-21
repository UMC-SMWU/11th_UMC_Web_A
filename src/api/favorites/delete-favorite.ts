import { apiClient } from "@/api/api-client";
import { useAuthStore } from "@/stores/auth-store";

export interface DeleteFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  reseult: string;
}

export function deleteFavorite(movieId: number) {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  return apiClient
    .delete(`favorites/${movieId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .json<DeleteFavoriteResponse>();
}
