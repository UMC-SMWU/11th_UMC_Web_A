import ky from "ky";
import { env } from "../config/env";

// 우리 서버 API가 같이 쓰는 클라이언트예요. (TMDB는 tmdbClient를 써요.)
export const apiClient = ky.create({ baseUrl: `${env.apiBaseUrl}/` });
