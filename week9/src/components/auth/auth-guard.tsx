"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

// Zustand Hydration 상태 구독
function subscribeToHydration(onStoreChange: () => void) {
  const unsubscribeHydrate = useAuthStore.persist.onHydrate(onStoreChange);

  const unsubscribeFinish =
    useAuthStore.persist.onFinishHydration(onStoreChange);

  return () => {
    unsubscribeHydrate();
    unsubscribeFinish();
  };
}

function getHydrationSnapshot() {
  return useAuthStore.persist.hasHydrated();
}

function getServerHydrationSnapshot() {
  return false;
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const accessToken = useAuthStore((state) => state.accessToken);

  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  useEffect(() => {
    if (hydrated && !accessToken) {
      router.replace("/login");
    }
  }, [hydrated, accessToken, router]);

  if (!hydrated) {
    return (
      <main className="p-8 text-center">로그인 상태를 확인하는 중이에요.</main>
    );
  }

  if (!accessToken) {
    return null;
  }

  return <>{children}</>;
}
