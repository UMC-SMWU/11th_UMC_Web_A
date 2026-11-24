import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "@/api/favorites/get-favorites";
import { useAuthStore } from "@/stores/auth-store";

export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: hasHydrated && Boolean(accessToken),
    staleTime: 30_000,
  });
}
