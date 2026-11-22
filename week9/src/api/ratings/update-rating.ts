import { authApi } from "../auth-api";

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
}

export function updateRating({ ratingId, score }: UpdateRatingRequest) {
  return authApi.patch(`ratings/${ratingId}`, {
    json: { score },
  });
}
