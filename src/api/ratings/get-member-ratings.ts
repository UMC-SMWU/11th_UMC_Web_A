import { authApi } from "../auth-api";

export interface MemberRating {
  ratingId: number;
  movieId: number;
  score: number;
}

interface MemberRatingsResponse {
  result: MemberRating[];
}

export async function getMemberRatings(memberId: number) {
  const response = await authApi
    .get(`members/${memberId}/ratings`)
    .json<MemberRatingsResponse>();

  return response.result;
}
