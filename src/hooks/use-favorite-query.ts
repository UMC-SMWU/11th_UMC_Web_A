import { useQuery } from "@tanstack/react-query";
import { getFavorite } from "@/api/favorites/get-favorite";
import { useAuthStore } from "@/stores/auth-store";

export function useFavoriteQuery(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavorite(movieId),
    enabled: Boolean(accessToken) && Number.isInteger(movieId) && movieId > 0,
    staleTime: 30_000,
  });
}
