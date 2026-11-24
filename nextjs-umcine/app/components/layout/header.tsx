"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useAuthStore } from "../../stores/auth-store";
import { useMeQuery } from "../../hooks/use-me-query";

const subscribe = () => () => {};

export default function Header() {
  // 서버와 hydration 중에는 false, 브라우저에 마운트된 뒤에는 true
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();

  return (
    <header className="flex items-center justify-between border-b border-[#eeeeee] bg-white px-10 py-4">
      <div className="flex items-center gap-10">
        <div className="text-lg font-bold text-[#111111]">🎬 UMCine</div>
        <nav className="flex gap-6">
          <Link
            href="/"
            className="text-[15px] font-medium text-[#666666] hover:text-[#111111]"
          >
            영화
          </Link>
          <Link
            href="/search"
            className="text-[15px] font-medium text-[#666666] hover:text-[#111111]"
          >
            검색
          </Link>
          <Link
            href="/profile"
            className="text-[15px] font-medium text-[#666666] hover:text-[#111111]"
          >
            내 정보
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/search"
          aria-label="검색"
          className="rounded-md border border-[#dddddd] bg-white px-3 py-2"
        >
          🔍
        </Link>

        {!mounted ? (
          // 서버 HTML과 첫 렌더링을 같게 맞추는 자리 표시
          <span className="h-9 w-24 rounded-md bg-gray-200" />
        ) : !accessToken ? (
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white"
          >
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span className="h-9 w-24 animate-pulse rounded-md bg-gray-200" />
        ) : (
          <Link
            href="/profile"
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white"
          >
            마이페이지
          </Link>
        )}
      </div>
    </header>
  );
}