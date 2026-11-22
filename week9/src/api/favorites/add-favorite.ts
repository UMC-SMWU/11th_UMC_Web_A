import { authApi } from "../auth-api";

export async function addFavorite(movieId: number) {
  await authApi.post("favorites", {
    json: { movieId },
  });
}
