import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberInfo } from "../api/members/me";
import { updateMe } from "../api/members/update-me";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      // 응답이 내 정보 조회와 같은 형태라서 다시 조회하지 않고 캐시를 바로 바꿔요.
      queryClient.setQueryData<MemberInfo>(["members", "me"], response.result);
      alert("내 정보 수정에 성공했어요.");
    },
    onError: () => {
      alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
