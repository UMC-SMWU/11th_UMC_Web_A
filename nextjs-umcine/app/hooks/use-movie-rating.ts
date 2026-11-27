"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../api/ratings/create-rating";
import { deleteRating } from "../api/ratings/delete-rating";
import { getMemberRatings } from "../api/ratings/get-member-ratings";
import type { Rating } from "../api/ratings/get-member-ratings";
import { updateRating } from "../api/ratings/update-rating";
import { useAuthStore } from "../stores/auth-store";
import { useMeQuery } from "./use-me-query";

export function useMovieRating(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const meQuery = useMeQuery();
  const memberId = meQuery.data?.memberId;
  const ratingsKey = ["members", memberId, "ratings"];

  const ratingsQuery = useQuery({
    queryKey: ratingsKey,
    queryFn: () => getMemberRatings(memberId as number),
    enabled: memberId !== undefined,
  });

  // 내 전체 평점 중 현재 영화의 평점
  const current = ratingsQuery.data?.find((r) => r.movieId === movieId) ?? null;

  const createMutation = useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ratingsKey });
      alert("평점을 저장했어요.");
    },
    onError: () => alert("평점 저장에 실패했어요. 다시 시도해 주세요."),
  });

  const updateMutation = useMutation({
    mutationFn: (v: { ratingId: number; score: number; content: string }) =>
      updateRating(v.ratingId, { score: v.score, content: v.content }),
    onSuccess: (response) => {
      queryClient.setQueryData<Rating[]>(ratingsKey, (prev) =>
        prev?.map((r) =>
          r.ratingId === response.result.ratingId ? response.result : r,
        ),
      );
      alert("평점을 수정했어요.");
    },
    onError: () => alert("평점 수정에 실패했어요. 다시 시도해 주세요."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRating,
    onSuccess: (_, ratingId) => {
      queryClient.setQueryData<Rating[]>(ratingsKey, (prev) =>
        prev?.filter((r) => r.ratingId !== ratingId),
      );
      alert("평점을 삭제했어요.");
    },
    onError: () => alert("평점 삭제에 실패했어요. 다시 시도해 주세요."),
  });

  return {
    isLoggedIn: Boolean(accessToken),
    isLoading: meQuery.isPending || ratingsQuery.isPending,
    isError: meQuery.isError || ratingsQuery.isError,
    current,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: deleteMutation.mutate,
  };
}