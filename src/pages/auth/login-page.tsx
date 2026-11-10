import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = email.trim().length > 0 && password.length > 0;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) return;

    // 실제 로그인 API는 8주차에서 연결
    alert("로그인 화면 테스트 성공!");
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
            disabled={!isFormValid}
            className="mt-1 h-12 w-full rounded-md bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            로그인
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
