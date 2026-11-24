import { useQuery } from "@tanstack/react-query";
import { getMemberRatings } from "@/api/ratings/get-member-ratings";
import { useAuthStore } from "@/stores/auth-store";

export function useMemberRatingsQuery(memberId?: number) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["members", memberId, "ratings"],
    queryFn: () => getMemberRatings(memberId!),
    enabled:
      Boolean(accessToken) &&
      memberId !== undefined &&
      Number.isInteger(memberId) &&
      memberId > 0,
    staleTime: 30_000,
  });
}
