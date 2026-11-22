"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { useUpdateMeMutation } from "../../hook/use-update-me-mutation";

export function EditProfilePage() {
  // 로그인 토큰 가져오기
  const accessToken = useAuthStore((state) => state.accessToken);

  // 현재 회원 정보 조회
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // 닉네임 입력값
  const [editedNickname, setEditedNickname] = useState<string | null>(null);

  const nickname = editedNickname ?? meQuery.data?.nickname ?? "";

  // 내 정보 수정 Mutation
  const updateMeMutation = useUpdateMeMutation();

  // 닉네임 유효성 검사
  const trimmedNickname = nickname.trim();

  const canSubmit = trimmedNickname.length >= 2 && trimmedNickname.length <= 12;

  // 닉네임 수정 제출
  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate({
      nickname: trimmedNickname,
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-90px)] justify-center bg-white px-5 py-12">
      <div className="w-full max-w-[420px]">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">내 정보 수정</h1>

        {/* 회원 정보 로딩 */}
        {meQuery.isLoading ? (
          <p className="text-sm text-gray-500">회원 정보를 불러오는 중...</p>
        ) : meQuery.isError ? (
          <p className="text-sm text-red-500">회원 정보를 불러오지 못했어요.</p>
        ) : !accessToken ? (
          <p className="text-sm text-gray-500">로그인이 필요합니다.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* 이메일 - 수정 불가능 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900">
                이메일
              </label>

              <input
                type="email"
                value={meQuery.data?.email ?? ""}
                disabled
                className="h-12 w-full rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-gray-500"
              />
            </div>

            {/* 닉네임 */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="nickname"
                className="text-sm font-semibold text-gray-900"
              >
                닉네임
              </label>

              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setEditedNickname(e.target.value)}
                placeholder="2~12자"
                className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-indigo-500"
              />

              <p className="text-xs text-gray-400">
                닉네임은 2~12자로 입력해 주세요.
              </p>
            </div>

            {/* 가입일 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-900">
                가입일
              </label>

              <input
                type="text"
                value={meQuery.data?.createdAt ?? ""}
                disabled
                className="h-12 w-full rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-gray-500"
              />
            </div>

            {/* 저장 버튼 */}
            <button
              type="submit"
              disabled={!canSubmit || updateMeMutation.isPending}
              className="mt-2 h-12 w-full rounded-md bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateMeMutation.isPending ? "저장 중" : "저장"}
            </button>

            {/* 마이페이지 이동 */}
            <Link
              href="/my"
              className="text-center text-sm text-gray-500 hover:text-gray-700"
            >
              취소
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
