import ky from "ky";
import { env } from "../config/env";

// base URL과 인증 header를 한 번만 설정해서 모든 영화 API 함수가 같이 써요.
// ky는 .json<T>()를 호출할 때 Accept header를 자동으로 설정해서 Authorization만 작성해요.
export const tmdbClient = ky.create({
  baseUrl: `${env.tmdbApiBaseUrl}/`,
  headers: {
    Authorization: `Bearer ${env.tmdbAccessToken}`,
  },
});
