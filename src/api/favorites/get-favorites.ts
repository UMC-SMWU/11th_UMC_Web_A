import { apiClient } from "@/api/api-client";
import { useAuthStore } from "@/stores/auth-store";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export interface GetFavoritesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Favorite[];
}

export function getFavorites() {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  return apiClient
    .get("favorites", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .json<GetFavoritesResponse>();
}
