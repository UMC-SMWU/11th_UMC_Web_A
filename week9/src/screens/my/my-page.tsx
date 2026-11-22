"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { useFavorites } from "../../hook/use-favorites";

export function MyPage() {
  // 로그인 토큰
  const accessToken = useAuthStore((state) => state.accessToken);

  // 실제 회원 정보 조회
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // 즐겨찾기 목록 조회
  const favoritesQuery = useFavorites();

  // 회원 정보
  const member = meQuery.data;

  if (!accessToken) {
    return <div className="py-12 text-center">로그인이 필요합니다.</div>;
  }

  if (meQuery.isLoading) {
    return (
      <div className="py-12 text-center">회원 정보를 불러오는 중이에요.</div>
    );
  }

  if (meQuery.isError || !member) {
    return (
      <div className="py-12 text-center text-red-500">
        회원 정보를 불러오지 못했어요.
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-90px)] items-center justify-center px-5 py-12">
      <div className="w-full max-w-[420px]">
        {/* 페이지 제목 */}
        <h1 className="mb-8 text-3xl font-bold text-gray-900">내 정보</h1>

        {/* 프로필 이미지 */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-4xl font-bold text-indigo-600">
            {member.nickname.charAt(0)}
          </div>

          <p className="text-lg font-semibold text-gray-900">
            {member.nickname}
          </p>
        </div>

        {/* 이메일 */}
        <div className="mb-5 flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">이메일</label>

          <div className="flex h-12 items-center rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-500">
            {member.email}
          </div>
        </div>

        {/* 닉네임 */}
        <div className="mb-7 flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">닉네임</label>

          <div className="flex h-12 items-center rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-500">
            {member.nickname}
          </div>
        </div>

        {/* 수정 페이지 이동 */}
        <Link
          href="/my/edit"
          className="flex h-12 w-full items-center justify-center rounded-md bg-indigo-600 text-sm font-semibold text-white"
        >
          내 정보 수정
        </Link>

        {/* 즐겨찾기 목록 */}
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            내가 즐겨찾기한 영화
          </h2>

          {favoritesQuery.isLoading ? (
            <p className="text-sm text-gray-500">
              즐겨찾기 목록을 불러오는 중이에요.
            </p>
          ) : favoritesQuery.isError ? (
            <p className="text-sm text-red-500">
              즐겨찾기 목록을 불러오지 못했어요.
            </p>
          ) : favoritesQuery.data?.length === 0 ? (
            <p className="text-sm text-gray-500">
              아직 즐겨찾기한 영화가 없어요.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {favoritesQuery.data?.map((movie) => (
                <Link
                  key={movie.movieId}
                  href={`/movies/${movie.movieId}`}
                  className="rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                >
                  <p className="text-sm font-semibold text-gray-900">
                    {movie.title}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
