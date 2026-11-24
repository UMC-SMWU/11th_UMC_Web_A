"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/hooks/use-login-mutation";
import { useAuthStore } from "@/stores/auth-store";

const fieldClassName =
  "flex h-11 items-center gap-2 rounded-lg border border-[#E3E6EB] bg-white px-3 focus-within:border-[#485cde]";

const inputClassName =
  "min-w-0 flex-1 text-sm text-black placeholder:text-[#969DA8] outline-none";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const router = useRouter();

  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const loginMutation = useLoginMutation();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (hasHydrated && accessToken) {
      router.replace("/");
    }
  }, [hasHydrated, accessToken, router]);

  const canSubmit =
    EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  if (!hasHydrated || accessToken) {
    return null;
  }

  return (
    <main className="grid min-h-[calc(100dvh-80px)] place-items-center bg-[#f5f6f8] px-5 py-10 text-[#19191f]">
      <section className="w-full max-w-[360px]">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">로그인</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
                value={form.email}
                onChange={(event) => {
                  const email = event.target.value;
                  setForm((previous) => ({ ...previous, email }));
                }}
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
                value={form.password}
                onChange={(event) => {
                  const password = event.target.value;
                  setForm((previous) => ({ ...previous, password }));
                }}
                required
                className={inputClassName}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loginMutation.isPending}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#2563EB] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#485cde]/50"
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-[#606774]">
          처음이신가요?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#485cde] hover:underline"
          >
            회원가입
          </Link>
        </p>
      </section>
    </main>
  );
}
