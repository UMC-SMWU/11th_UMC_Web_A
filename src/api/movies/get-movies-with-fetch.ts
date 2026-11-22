import { env } from "../../config/env";
import type { TmdbMovieListResponse } from "./models";

type GetMoviesWithFetchResponse = TmdbMovieListResponse;

// 순수 fetch로 인기 영화를 요청해 보는 학습용 함수예요. 화면에서는 ky 기반 getMovies를 사용해요.
async function getMoviesWithFetch(page = 1): Promise<GetMoviesWithFetchResponse> {
  const searchParams = new URLSearchParams({
    language: "ko-KR",
    page: String(page),
  });

  const response = await fetch(`${env.tmdbApiBaseUrl}/movie/popular?${searchParams}`, {
    headers: {
      Authorization: `Bearer ${env.tmdbAccessToken}`,
    },
  });

  // fetch는 404나 500 응답에서도 reject하지 않아서 response.ok를 직접 확인해요.
  if (!response.ok) {
    throw new Error(`영화 목록 요청에 실패했어요: ${response.status}`);
  }

  return response.json();
}

export { getMoviesWithFetch, type GetMoviesWithFetchResponse };
