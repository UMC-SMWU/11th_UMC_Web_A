import { authApi } from "../auth-api";

interface DeleteRatingApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}

export async function deleteRating(
  ratingId: number,
): Promise<DeleteRatingApiResponse> {
  return authApi.delete(`ratings/${ratingId}`).json<DeleteRatingApiResponse>();
}
