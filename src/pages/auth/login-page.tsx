import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type LoginFormKey = keyof typeof DEFAULT_FORM;

const labelClass = "text-sm font-bold text-[#111111]";
const inputClass =
  "h-12 w-full rounded-xl border border-[#e5e7eb] bg-white pl-11 pr-4 text-sm outline-none placeholder:text-[#9ca3af] focus:border-blue-600";
const iconClass =
  "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]";

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  //const [isSubmitting, setIsSubmitting] = useState(false);
  //const setAccessToken = useAuthStore((state) => state.setAccessToken);

  // 이메일과 비밀번호가 모두 입력되어야 로그인 버튼 활성화
  //const isFormFilled = form.email.trim().length > 0 && form.password.length > 0;

  const handleChangeField = (key: LoginFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const loginMutation = useLoginMutation();
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

  return (
    <main className='flex justify-center bg-[#f7f7f8] px-6 pb-24 pt-52'>
      <div className='w-full max-w-md'>
        <h1 className='mb-6 text-4xl font-bold text-[#111111]'>로그인</h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          className='flex flex-col gap-4'
        >
          {/* 이메일 */}
          <div className='flex flex-col gap-2'>
            <label htmlFor='email' className={labelClass}>
              이메일
            </label>
            <div className='relative'>
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className={iconClass}
              >
                <rect x='3' y='5' width='18' height='14' rx='2' />
                <path d='m3 7 9 6 9-6' />
              </svg>
              <input
                id='email'
                type='email'
                autoComplete='email'
                placeholder='name@example.com'
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div className='flex flex-col gap-2'>
            <label htmlFor='password' className={labelClass}>
              비밀번호
            </label>
            <div className='relative'>
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className={iconClass}
              >
                <rect x='4' y='11' width='16' height='10' rx='2' />
                <path d='M8 11V7a4 4 0 0 1 8 0v4' />
              </svg>
              <input
                id='password'
                type='password'
                autoComplete='current-password'
                placeholder='비밀번호'
                value={form.password}
                onChange={(e) => handleChangeField("password", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <button
            type='submit'
            disabled={!canSubmit || loginMutation.isPending}
            className='mt-2 h-12 w-full cursor-pointer rounded-lg bg-blue-600 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-blue-300'
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-[#6b7280]'>
          처음이신가요?{" "}
          <Link to='/signup' className='font-bold text-blue-600'>
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
