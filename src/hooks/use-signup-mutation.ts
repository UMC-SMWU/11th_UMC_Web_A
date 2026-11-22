import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signup, type SignupRequest } from "../api/members/signup";
import { getApiErrorMessage } from "../utils/get-api-error-message";

export function useSignupMutation() {
  const navigate = useNavigate();

  return useMutation({
    // 실패하면 서버가 보낸 message(예: 이미 가입된 이메일)를 error.message로 넘겨요.
    mutationFn: async (body: SignupRequest) => {
      try {
        return await signup(body);
      } catch (error) {
        throw new Error(getApiErrorMessage(error, "회원가입에 실패했어요. 다시 시도해 주세요."));
      }
    },
    onSuccess: (response) => {
      alert(response.message);
      navigate({ to: "/login" });
    },
  });
}
