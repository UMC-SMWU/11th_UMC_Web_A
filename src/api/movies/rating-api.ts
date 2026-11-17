import type { Rating } from "../../types/rating";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1. 회원 평점 조회
export async function getMemberRatings(memberId: number): Promise<Rating[]> {
  const response = await fetch(`${API_BASE_URL}/members/${memberId}/ratings`);

  if (!response.ok) {
    throw new Error(`평점 조회 실패: ${response.status}`);
  }

  return response.json();
}

// 2. 평점 등록
export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

export async function createRating(body: CreateRatingRequest) {
  const response = await fetch(`${API_BASE_URL}/ratings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`평점 등록 실패: ${response.status}`);
  }
}

// 3. 평점 수정
export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  comment?: string;
}

export async function updateRating({
  ratingId,
  score,
  comment,
}: UpdateRatingRequest) {
  const response = await fetch(`${API_BASE_URL}/ratings/${ratingId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score, comment }),
  });

  if (!response.ok) {
    throw new Error(`평점 수정 실패: ${response.status}`);
  }
}

// 4. 평점 삭제
export async function deleteRating(ratingId: number) {
  const response = await fetch(`${API_BASE_URL}/ratings/${ratingId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`평점 삭제 실패: ${response.status}`);
  }
}
