import { apiClient } from "@/api/api-client";
import { useAuthStore } from "@/stores/auth-store";

export interface MemberRating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export type GetMemberRatingsResponse = MemberRating[];

export function getMemberRatings(memberId: number) {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  return apiClient
    .get(`members/${memberId}/ratings`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .json<GetMemberRatingsResponse>();
}
