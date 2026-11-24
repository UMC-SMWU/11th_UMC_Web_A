"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthHydrated } from "../../hooks/use-auth-hydrated";
import { useAuthStore } from "../../stores/auth-store";

// 로그인하지 않았다면 로그인 화면으로 보내요. (TanStack Router의 beforeLoad 대신 사용해요.)
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (hydrated && !accessToken) router.replace("/login");
  }, [hydrated, accessToken, router]);

  if (!hydrated || !accessToken) return null;
  return <>{children}</>;
}

// 이미 로그인했다면 로그인 화면 대신 홈으로 보내요.
export function GuestGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (hydrated && accessToken) router.replace("/");
  }, [hydrated, accessToken, router]);

  if (!hydrated || accessToken) return null;
  return <>{children}</>;
}
