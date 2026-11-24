import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub?: string;
}

export function getMemberIdFromToken(
  accessToken: string | null,
): number | undefined {
  if (!accessToken) return undefined;

  try {
    const payload = jwtDecode<JwtPayload>(accessToken);

    const memberId = Number(payload.sub);

    if (!Number.isSafeInteger(memberId) || memberId <= 0) {
      return undefined;
    }

    return memberId;
  } catch {
    return undefined;
  }
}
