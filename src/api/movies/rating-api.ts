import type { Rating } from "../../types/rating";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getMemberRatings(memberId: number): Promise<Rating[]> {
  const response = await fetch(`${API_BASE_URL}/members/${memberId}/ratings`);

  if (!response.ok) {
    throw new Error(`평점 조회 실패: ${response.status}`);
  }

  return response.json();
}
