import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth-store";

// 저장된 토큰을 브라우저에서 읽어 오는 일이 끝났는지 알려 줘요.
// 끝나기 전에는 토큰이 없는 것처럼 보여서, 로그인 여부로 화면을 나누기 전에 확인해야 해요.
export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
