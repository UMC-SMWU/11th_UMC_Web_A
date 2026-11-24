"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "@/stores/auth-store";

const ONE_MINUTE = 60 * 1000;

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: ONE_MINUTE,
          },
        },
      }),
  );

  useEffect(() => {
    async function hydrateAuth() {
      try {
        await useAuthStore.persist.rehydrate();
      } catch (error) {
        console.error("로그인 정보 복원 실패:", error);
      } finally {
        useAuthStore.getState().setHasHydrated(true);
      }
    }

    void hydrateAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
