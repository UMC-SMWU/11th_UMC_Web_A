// 특정 하나만 조회하는 것
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "../api-client";

export interface GetFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    isFavorite: boolean;
  };
}

export function getFavorite(movieId: number) {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  return apiClient
    .get(`favorites/${movieId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .json<GetFavoriteResponse>();
}
