import { authApi } from "../auth-api";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

export interface UpdateRatingRequest {
  score: number;
  comment?: string;
}

// 조회 응답은 공통 형식이 아니라 배열 그대로 와요.
export function getMemberRatings(memberId: number) {
  return authApi.get(`members/${memberId}/ratings`).json<Rating[]>();
}

export function createRating(body: CreateRatingRequest) {
  return authApi.post("ratings", { json: body }).json<ApiResponse<Rating>>();
}

export function updateRating(ratingId: number, body: UpdateRatingRequest) {
  return authApi.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<Rating>>();
}

export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
}
