"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

function Header() {
  const pathname = usePathname() ?? "";

  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="w-full border-b border-[#eeeeee] bg-white">
      <div className="mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between px-3 sm:gap-6 sm:px-4">
        {/* 왼쪽: 로고 + nav */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-[42px]">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 whitespace-nowrap text-xl font-bold text-black sm:text-2xl"
          >
            <img
              src="/icons/movie.svg"
              alt=""
              className="block h-10 w-10 rounded-lg border-2 border-black p-1"
            />
            UMCine
          </Link>

          <nav className="flex shrink-0 items-center gap-3 sm:gap-8">
            <Link
              href="/"
              className={`text-base font-medium text-black underline-offset-2 ${
                pathname === "/" ? "underline" : ""
              }`}
            >
              영화
            </Link>

            <Link
              href="/search"
              className={`text-base font-medium text-black underline-offset-2 ${
                pathname === "/search" || pathname.startsWith("/search/")
                  ? "underline"
                  : ""
              }`}
            >
              검색
            </Link>

            <Link
              href="/my"
              className={`text-base font-medium text-black underline-offset-2 ${
                pathname === "/my" || pathname.startsWith("/my/")
                  ? "underline"
                  : ""
              }`}
            >
              내 정보
            </Link>
          </nav>
        </div>

        {/* 오른쪽: 검색 + 로그인 */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link
            href="/search"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dddddd]"
          >
            <img src="/icons/search.svg" alt="검색" className="h-5 w-5" />
          </Link>

          {!accessToken ? (
            <Link
              href="/login"
              className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white"
            >
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <Link
              href="/my"
              className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white"
            >
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
