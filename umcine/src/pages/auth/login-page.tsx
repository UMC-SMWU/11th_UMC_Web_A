import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_FORM = {
  email: "",
  password: "",
};

type LoginFormKey = keyof typeof DEFAULT_FORM;

const inputClass =
  "h-12 w-full rounded-lg border border-line bg-white pr-4 pl-9 text-[15px] text-ink outline-none transition placeholder:text-muted focus:border-primary";
const labelClass = "mb-2 block text-sm font-bold text-ink";
const iconClass =
  "pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2";

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const loginMutation = useLoginMutation();

  // 이메일 형식이 맞고 비밀번호를 입력해야 로그인 버튼 활성화
  const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  const handleChangeField = (key: LoginFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <main className="flex min-h-[calc(100vh-91px)] items-center justify-center px-4 py-16">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-[430px]">
        <h1 className="mb-5 text-[32px] font-bold text-ink">로그인</h1>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className={labelClass}>
              이메일
            </label>
            <div className="relative">
              <img
                src="/icons/movie-icons/mail.svg"
                alt=""
                aria-hidden="true"
                className={iconClass}
              />
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              비밀번호
            </label>
            <div className="relative">
              <img
                src="/icons/movie-icons/lock.svg"
                alt=""
                aria-hidden="true"
                className={iconClass}
              />
              <input
                id="password"
                type="password"
                placeholder="비밀번호"
                value={form.password}
                onChange={(e) => handleChangeField("password", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loginMutation.isPending}
            className="h-12 w-full rounded-lg bg-primary text-[15px] font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-sub">
          처음이신가요?{" "}
          <Link to="/signup" className="font-bold text-primary">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}