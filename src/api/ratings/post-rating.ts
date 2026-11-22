import { authApi } from "../auth-api";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string;
}

export interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateRatingApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RatingResponse;
}

export async function postRating(
  request: CreateRatingRequest,
): Promise<RatingResponse> {
  const response = await authApi
    .post("ratings", {
      json: request,
    })
    .json<CreateRatingApiResponse>();

  return response.result;
}
