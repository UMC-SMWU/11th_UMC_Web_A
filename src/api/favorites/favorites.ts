import { HTTPError } from "ky";
import { authApi } from "../auth-api";

export interface Favorite {
  movieId: number;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<ApiResponse<Favorite[]>>();
  return response.result;
}

// 즐겨찾기가 아니면 404가 와서, 그때는 null로 바꿔요.
export async function getFavorite(movieId: number): Promise<Favorite | null> {
  try {
    const response = await authApi.get(`favorites/${movieId}`).json<ApiResponse<Favorite>>();
    return response.result;
  } catch (error) {
    if (error instanceof HTTPError && error.response.status === 404) return null;
    throw error;
  }
}

export function addFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>();
}

export function removeFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}
