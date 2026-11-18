import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  deleteRating,
  getMemberRatings,
  updateRating,
  type Rating,
} from "../api/ratings/ratings";
import { useAuthStore } from "../stores/auth-store";
import { getMemberIdFromToken } from "../utils/auth/get-member-id-from-token";

const ratingKeys = {
  member: (memberId: number | null) => ["members", memberId, "ratings"] as const,
};

export function useMemberId() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return getMemberIdFromToken(accessToken);
}

export function useMyRatingsQuery() {
  const memberId = useMemberId();

  return useQuery({
    queryKey: ratingKeys.member(memberId),
    queryFn: () => {
      if (memberId === null) throw new Error("로그인이 필요해요.");
      return getMemberRatings(memberId);
    },
    enabled: memberId !== null,
    retry: false,
  });
}

// 내 평점 목록 캐시를 직접 수정
function useSetMyRatings() {
  const queryClient = useQueryClient();
  const memberId = useMemberId();

  return (updater: (prev: Rating[]) => Rating[]) => {
    queryClient.setQueryData<Rating[]>(ratingKeys.member(memberId), (prev) =>
      prev ? updater(prev) : prev,
    );
  };
}

function useInvalidateMyRatings() {
  const queryClient = useQueryClient();
  const memberId = useMemberId();

  return () => queryClient.invalidateQueries({ queryKey: ratingKeys.member(memberId) });
}

export function useCreateRatingMutation() {
  const setMyRatings = useSetMyRatings();
  const invalidateMyRatings = useInvalidateMyRatings();

  return useMutation({
    mutationFn: createRating,
    onSuccess: (response) => {
      // ratingId 내림차순이라 새 평점을 맨 앞에 추가
      setMyRatings((prev) => [response.result, ...prev]);
      alert("평점을 등록했어요.");
    },
    onError: () => {
      invalidateMyRatings();
      alert("평점 등록에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useUpdateRatingMutation() {
  const setMyRatings = useSetMyRatings();
  const invalidateMyRatings = useInvalidateMyRatings();

  return useMutation({
    mutationFn: updateRating,
    onSuccess: (response) => {
      setMyRatings((prev) =>
        prev.map((rating) =>
          rating.ratingId === response.result.ratingId ? response.result : rating,
        ),
      );
      alert("평점을 수정했어요.");
    },
    onError: () => {
      invalidateMyRatings();
      alert("평점 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useDeleteRatingMutation() {
  const setMyRatings = useSetMyRatings();
  const invalidateMyRatings = useInvalidateMyRatings();

  return useMutation({
    mutationFn: deleteRating,
    onSuccess: (_, ratingId) => {
      // 삭제 응답의 result는 null이라 요청에 보낸 ratingId로 제거
      setMyRatings((prev) => prev.filter((rating) => rating.ratingId !== ratingId));
      alert("평점을 삭제했어요.");
    },
    onError: () => {
      invalidateMyRatings();
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}