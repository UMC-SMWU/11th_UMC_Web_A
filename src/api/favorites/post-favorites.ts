import { apiClient } from "@/api/api-client";
import { useAuthStore } from "@/stores/auth-store";

export interface CreateFavoriteRequest {
  movieId: number;
}

export interface CreateFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    favoriteId: number;
    movieId: number;
    createdAt: string;
  };
}

export function postFavorite({ movieId }: CreateFavoriteRequest) {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  return apiClient
    .post("favorites", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      json: {
        movieId,
      },
    })
    .json<CreateFavoriteResponse>();
}
