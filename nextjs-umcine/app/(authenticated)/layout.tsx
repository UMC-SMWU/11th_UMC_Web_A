"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { useAuthStore } from "../stores/auth-store";

// 토큰 복원이 끝났는지 구독
function subscribeHydration(onChange: () => void) {
  return useAuthStore.persist?.onFinishHydration(onChange) ?? (() => {});
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => useAuthStore.persist?.hasHydrated() ?? false, // 브라우저
    () => false, // 서버 (빌드 포함)
  );

  useEffect(() => {
    if (hydrated && !accessToken) router.replace("/login");
  }, [hydrated, accessToken, router]);

  if (!hydrated || !accessToken) return null;
  return <>{children}</>;
}