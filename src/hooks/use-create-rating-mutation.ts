import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRating } from "@/api/ratings/post-rating";

export function useCreateRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postRating,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-ratings"],
      });
    },
  });
}
