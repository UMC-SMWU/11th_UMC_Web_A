import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchRating } from "@/api/ratings/patch-rating";

export function useUpdateRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchRating,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-ratings"],
      });
    },
  });
}
