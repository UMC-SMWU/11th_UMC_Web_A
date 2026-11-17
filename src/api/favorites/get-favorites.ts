import { authApi } from "../auth-api";

export interface FavoriteMovie {
  movieId: number;
  title: string;
  posterPath: string | null;
}

interface FavoritesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteMovie[];
}

export async function getFavorites(): Promise<FavoriteMovie[]> {
  const response = await authApi.get("favorites").json<FavoritesResponse>();

  return response.result;
}
