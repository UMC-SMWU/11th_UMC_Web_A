import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login, type LoginRequest } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";
import { getApiErrorMessage } from "../utils/get-api-error-message";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    // 실패하면 서버가 보낸 message를 error.message로 넘겨요.
    mutationFn: async (body: LoginRequest) => {
      try {
        return await login(body);
      } catch (error) {
        throw new Error(getApiErrorMessage(error, "로그인에 실패했어요. 다시 시도해 주세요."));
      }
    },
    onSuccess: (response) => {
      setAccessToken(response.result.accessToken);
      alert("로그인에 성공했어요.");
      // 로그인 결과가 바뀌었으니 내 정보 캐시를 stale로 만들어요.
      queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      navigate({ to: "/" });
    },
  });
}
