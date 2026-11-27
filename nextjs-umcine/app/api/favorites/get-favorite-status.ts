import { isHTTPError } from "ky";
import { authApi } from "../auth-api";

export async function getFavoriteStatus(movieId: number): Promise<boolean> {
  try {
    await authApi.get(`favorites/${movieId}`);
    return true;
  } catch (error) {
    if (isHTTPError(error) && error.response.status === 404) return false;
    throw error;
  }
}