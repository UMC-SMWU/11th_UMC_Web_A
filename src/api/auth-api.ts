import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

// 토큰을 헤더에 붙이는 인증용 클라이언트예요. 401이면 저장된 토큰을 비워요.
export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
