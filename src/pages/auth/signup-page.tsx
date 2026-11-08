import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

const labelClass = "text-sm font-bold text-[#111111]";
const inputClass =
  "h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none placeholder:text-[#9ca3af] focus:border-blue-600";
const checkButtonClass =
  "absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-sm font-bold text-blue-600";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효하면 제출 버튼 활성화
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();

    // 3.4에서 회원가입 API 요청 추가
  };

  // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
  return (
    <main className="flex justify-center bg-[#f7f7f8] px-6 pb-24 pt-32">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-4xl font-bold text-[#111111]">회원가입</h1>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* 이메일 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={labelClass}>
              이메일
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
                aria-invalid={showEmailError}
                className={cn(
                  inputClass,
                  "pr-24",
                  showEmailError ? "border-red-500" : "border-[#e5e7eb]",
                )}
              />
              <button type="button" className={checkButtonClass}>
                중복 확인
              </button>
            </div>
            {showEmailError && (
              <p className="text-xs text-red-500">
                올바른 이메일 형식이 아니에요.
              </p>
            )}
          </div>

          {/* 닉네임 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="nickname" className={labelClass}>
              닉네임
            </label>
            <div className="relative">
              <input
                id="nickname"
                type="text"
                autoComplete="nickname"
                placeholder="2–12자"
                value={form.nickname}
                onChange={(e) => handleChangeField("nickname", e.target.value)}
                aria-invalid={showNicknameError}
                className={cn(
                  inputClass,
                  "pr-24",
                  showNicknameError ? "border-red-500" : "border-[#e5e7eb]",
                )}
              />
              <button type="button" className={checkButtonClass}>
                중복 확인
              </button>
            </div>
            {showNicknameError && (
              <p className="text-xs text-red-500">
                닉네임은 2자 이상 12자 이하로 입력해 주세요.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className={labelClass}>
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="8자 이상"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              aria-invalid={showPasswordError}
              className={cn(
                inputClass,
                showPasswordError ? "border-red-500" : "border-[#e5e7eb]",
              )}
            />
            <p
              className={cn(
                "text-xs",
                showPasswordError ? "text-red-500" : "text-[#9ca3af]",
              )}
            >
              영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해
              주세요
            </p>
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="passwordConfirm" className={labelClass}>
              비밀번호 확인
            </label>
            <input
              id="passwordConfirm"
              type="password"
              autoComplete="new-password"
              placeholder="다시 입력"
              value={form.passwordConfirm}
              onChange={(e) =>
                handleChangeField("passwordConfirm", e.target.value)
              }
              aria-invalid={showPasswordConfirmError}
              className={cn(
                inputClass,
                showPasswordConfirmError
                  ? "border-red-500"
                  : "border-[#e5e7eb]",
              )}
            />
            {showPasswordConfirmError && (
              <p className="text-xs text-red-500">비밀번호가 일치하지 않아요.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className="mt-2 h-12 w-full cursor-pointer rounded-lg bg-blue-600 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            가입하기
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6b7280]">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-bold text-blue-600">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}