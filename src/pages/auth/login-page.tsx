import { useState } from "react";
import { Link } from "@tanstack/react-router";

const fieldClassName =
  "flex h-11 items-center gap-2 rounded-lg border border-[#E3E6EB] bg-white px-3 focus-within:border-[#485cde]";

const inputClassName =
  "min-w-0 flex-1 text-sm text-black placeholder:text-[#969DA8] outline-none";

export function LoginPage() {
  const [message, setMessage] = useState("");

  return (
    <main className="grid min-h-[calc(100dvh-80px)] place-items-center bg-[#f5f6f8] px-5 py-10 text-[#19191f]">
      <section className="w-full max-w-[360px]">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">로그인</h1>

        <form
          className="space-y-4"
          onChange={() => setMessage("")}
          onSubmit={(event) => {
            event.preventDefault();
            setMessage("로그인 API가 아직 연결되지 않았어요.");
          }}
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-semibold"
            >
              이메일
            </label>
            <div className={fieldClassName}>
              <img src="/icons/mail.svg" alt="" className="size-4 shrink-0" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="name@example.com"
                required
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-semibold"
            >
              비밀번호
            </label>
            <div className={fieldClassName}>
              <img src="/icons/lock.svg" alt="" className="size-4 shrink-0" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="비밀번호"
                required
                className={inputClassName}
              />
            </div>
          </div>

          <button
            type="submit"
            className="h-11 w-full rounded-lg bg-[#2563EB] text-sm font-semibold text-white"
          >
            로그인
          </button>

          {message && (
            <p role="status" className="text-center text-xs text-gray-600">
              {message}
            </p>
          )}
        </form>

        <p className="mt-5 text-center text-xs text-[#606774]">
          처음이신가요?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[#485cde] hover:underline"
          >
            회원가입
          </Link>
        </p>
      </section>
    </main>
  );
}
