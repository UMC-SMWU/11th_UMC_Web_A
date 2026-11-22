import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  deleteRating,
  getMemberRatings,
  updateRating,
  type UpdateRatingRequest,
} from "../api/ratings/ratings";
import { useAuthStore } from "../stores/auth-store";
import { getMemberIdFromToken } from "../utils/auth/get-member-id";

export function useMemberId() {
  return getMemberIdFromToken(useAuthStore((state) => state.accessToken));
}

export function useMyRatingsQuery() {
  const memberId = useMemberId();

  return useQuery({
    queryKey: ["members", memberId, "ratings"],
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== null,
    retry: false,
  });
}

// 평점이 바뀌면 내 평점 목록을 다시 조회해요.
export function useRatingMutations() {
  const queryClient = useQueryClient();
  const memberId = useMemberId();
  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["members", memberId, "ratings"] });
  const onError = () => alert("요청에 실패했어요. 다시 시도해 주세요.");

  const create = useMutation({ mutationFn: createRating, onSuccess: refresh, onError });
  const update = useMutation({
    mutationFn: ({ ratingId, ...body }: UpdateRatingRequest & { ratingId: number }) =>
      updateRating(ratingId, body),
    onSuccess: refresh,
    onError,
  });
  const remove = useMutation({ mutationFn: deleteRating, onSuccess: refresh, onError });

  return { create, update, remove };
}
