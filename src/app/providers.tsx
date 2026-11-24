"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function Providers({ children }: { children: ReactNode }) {
  // 렌더링될 때마다 새 QueryClient가 만들어지지 않게 state로 한 번만 만들어요.
  const [queryClient] = useState(() => new QueryClient());

  // 서버에는 localStorage가 없어서 저장된 토큰은 브라우저에서만 읽어요.
  // 서버가 만든 HTML과 첫 화면을 똑같이 맞추려고 마운트된 뒤에 불러와요.
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
