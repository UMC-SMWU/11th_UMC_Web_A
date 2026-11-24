// Next.js는 브라우저로 보내는 환경 변수 이름을 NEXT_PUBLIC_으로 시작해야 해요.
// 값을 빌드할 때 코드에 끼워 넣기 때문에 process.env.이름을 그대로 적어야 해요. (process.env[name]은 안 돼요.)
const tmdbApiBaseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;
const tmdbAccessToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

// 값이 비어 있으면 요청을 보내기 전에 바로 알 수 있게 해요. (401 응답과 구분하기 위해서예요.)
if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수가 필요해요.");
}

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  // 우리 서버 주소예요. .env.local의 NEXT_PUBLIC_API_BASE_URL로 설정해요.
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
};
