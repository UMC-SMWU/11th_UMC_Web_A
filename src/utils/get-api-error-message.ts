import { isHTTPError } from "ky";

// 서버가 보낸 공통 응답의 message를 꺼내요. 없으면 fallback을 써요.
// ky는 에러를 만들 때 응답 본문을 미리 읽어서 error.data에 담아 두므로,
// error.response.json()이 아니라 error.data를 써야 해요.
export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!isHTTPError(error)) return fallback;
  const data = error.data as { message?: string } | undefined;
  return data?.message || fallback;
}
