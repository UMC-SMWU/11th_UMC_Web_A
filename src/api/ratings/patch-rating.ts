import { authApi } from "../auth-api";
import type { RatingResponse } from "./post-rating";

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  comment: string;
}

interface UpdateRatingApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RatingResponse;
}

export async function patchRating({
  ratingId,
  score,
  comment,
}: UpdateRatingRequest): Promise<RatingResponse> {
  const response = await authApi
    .patch(`ratings/${ratingId}`, {
      json: {
        score,
        comment,
      },
    })
    .json<UpdateRatingApiResponse>();
  return response.result;
}
