import { authApi } from "../auth-api";

export interface FavoriteItem {
  movieId: number;
  title?: string;
  posterPath?: string | null;
  releaseDate?: string;
}

interface FavoritesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteItem[];
}

export async function getFavorites(): Promise<FavoriteItem[]> {
  const response = await authApi.get("favorites").json<FavoritesResponse>();
  return response.result;
}