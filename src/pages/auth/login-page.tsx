import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLoginMutation } from "../../hook/use-login-mutation";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 로그인 API 요청 관리
  const loginMutation = useLoginMutation();

  // 입력값 유효성 검사
  const canSubmit = EMAIL_REGEX.test(email.trim()) && password.length > 0;

  // 로그인 제출
  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: email.trim(),
      password: password,
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-90px)] items-center justify-center px-5 py-12">
      <div className="w-full max-w-[420px]">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">로그인</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 이메일 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-gray-900"
            >
              이메일
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none placeholder:text-gray-400 focus:border-indigo-500"
            />
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-900"
            >
              비밀번호
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none placeholder:text-gray-400 focus:border-indigo-500"
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!canSubmit || loginMutation.isPending}
            className="mt-1 h-12 w-full rounded-md bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>
        </form>

        {/* 회원가입 페이지 이동 */}
        <p className="mt-4 text-center text-xs text-gray-400">
          아직 계정이 없나요?{" "}
          <Link
            to="/signup"
            className="font-semibold text-indigo-600 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
