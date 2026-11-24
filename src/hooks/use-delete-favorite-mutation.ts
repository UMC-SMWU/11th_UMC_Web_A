import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFavorite } from "@/api/favorites/delete-favorite";

export function useDeleteFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFavorite,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });
}
