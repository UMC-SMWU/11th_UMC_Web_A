import { Link, useNavigate } from "@tanstack/react-router";
import { signup } from "../../api/members/signup";
import { useState } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";

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

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];
type DuplicateCheckKey = "email" | "nickname";

const inputClass = (hasError: boolean) =>
  `h-12 w-full rounded-lg border bg-white px-4 text-[15px] text-[#17191E] outline-none transition placeholder:text-[#969DA8] disabled:bg-[#F6F7F9] ${
    hasError
      ? "border-red-500 focus:border-red-500"
      : "border-[#E3E6EB] focus:border-[#2563EB]"
  }`;

const labelClass = "mb-2 block text-sm font-bold text-[#17191E]";
const errorClass = "mt-1.5 text-xs text-red-500";
const checkButtonClass =
  "absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#2563EB] disabled:text-[#969DA8]";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  // 3.3 중복 확인 상태 (필드별로 확인 중인지, 사용 가능한지)
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

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

  // 모든 입력값이 유효한지
  const isFormValid =
    isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());
      const isAvailable = response.available;
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable },
      }));
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
      navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-91px)] items-center justify-center bg-[#F6F7F9] px-4 py-16">
      {/* noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔 */}
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-[430px]">
        <h1 className="mb-5 text-[32px] font-bold text-[#17191E]">회원가입</h1>

        <div className="flex flex-col gap-4">
          {/* 이메일 */}
          <div>
            <label htmlFor="email" className={labelClass}>
              이메일
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                disabled={duplicateCheck.email.isChecking}
                onChange={(e) => handleChangeField("email", e.target.value)}
                className={`${inputClass(showEmailError)} pr-24`}
              />
              <button
                type="button"
                disabled={!isEmailValid || duplicateCheck.email.isChecking}
                onClick={() => handleCheckDuplicate("email")}
                className={checkButtonClass}
              >
                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showEmailError && (
              <p className={errorClass}>올바른 이메일 형식이 아니에요.</p>
            )}
          </div>

          {/* 닉네임 */}
          <div>
            <label htmlFor="nickname" className={labelClass}>
              닉네임
            </label>
            <div className="relative">
              <input
                id="nickname"
                placeholder="2~12자"
                value={form.nickname}
                disabled={duplicateCheck.nickname.isChecking}
                onChange={(e) => handleChangeField("nickname", e.target.value)}
                className={`${inputClass(showNicknameError)} pr-24`}
              />
              <button
                type="button"
                disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
                onClick={() => handleCheckDuplicate("nickname")}
                className={checkButtonClass}
              >
                {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showNicknameError && (
              <p className={errorClass}>닉네임은 2~12자로 입력해 주세요.</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="password" className={labelClass}>
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              placeholder="8자 이상"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              className={inputClass(showPasswordError)}
            />
            <p
              className={`mt-1.5 text-[11px] ${
                showPasswordError ? "text-red-500" : "text-[#969DA8]"
              }`}
            >
              영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
            </p>
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label htmlFor="passwordConfirm" className={labelClass}>
              비밀번호 확인
            </label>
            <input
              id="passwordConfirm"
              type="password"
              placeholder="다시 입력"
              value={form.passwordConfirm}
              onChange={(e) => handleChangeField("passwordConfirm", e.target.value)}
              className={inputClass(showPasswordConfirmError)}
            />
            {showPasswordConfirmError && (
              <p className={errorClass}>비밀번호가 일치하지 않아요.</p>
            )}
          </div>

          {/* 요청 중에는 비활성화 + 문구 변경 */}
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="h-12 w-full rounded-lg bg-[#2563EB] text-[15px] font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-[#E3E6EB] disabled:text-[#969DA8]"
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-[#606774]">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-bold text-[#2563EB]">
            로그인
          </Link>
        </p>
      </form>
    </main>
  );
}