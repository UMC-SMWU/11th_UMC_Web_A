import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createRating,
  updateRating,
  deleteRating,
} from "../api/movies/rating-api";

export function useRatingMutations() {
  const queryClient = useQueryClient();

  const invalidateRatings = () => {
    return queryClient.invalidateQueries({
      queryKey: ["ratings"],
    });
  };

  const createMutation = useMutation({
    mutationFn: createRating,
    onSuccess: invalidateRatings,
  });

  const updateMutation = useMutation({
    mutationFn: updateRating,
    onSuccess: invalidateRatings,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRating,
    onSuccess: invalidateRatings,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
