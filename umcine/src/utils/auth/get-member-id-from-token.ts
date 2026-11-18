// JWT는 "헤더.내용.서명" 형태이고, 가운데 내용(payload)은 base64url로 인코딩된 JSON
export function getMemberIdFromToken(token: string | null): number | null {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));
    const memberId = Number(decoded.memberId ?? decoded.sub);

    return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}