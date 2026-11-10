import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import {
  AuthCard,
  Field,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../../components/auth/auth-form-parts";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
// 정규식에 g 플래그를 붙이면 test()를 부를 때마다 결과가 달라질 수 있어서 붙이지 않아요.
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid = form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError = form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효하면 제출 버튼 활성화
  const isFormValid = isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid && duplicateCheck.email.isAvailable && duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: string) => {
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
      alert(isAvailable ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`);
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

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
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
    <AuthCard title="회원가입">
      {/* noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔 */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Field
          label="이메일"
          htmlFor="email"
          error={showEmailError ? "올바른 이메일 형식이 아니에요." : undefined}
          success={duplicateCheck.email.isAvailable ? "사용할 수 있는 이메일이에요." : undefined}
        >
          <div className="flex gap-2">
            <input
              id="email"
              type="email"
              placeholder="example@umc.com"
              className={inputClass}
              value={form.email}
              disabled={duplicateCheck.email.isChecking}
              onChange={(e) => handleChangeField("email", e.target.value)}
            />
            <button
              type="button"
              className={secondaryButtonClass}
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
        </Field>

        <Field
          label="닉네임"
          htmlFor="nickname"
          hint="2자 이상 12자 이하로 입력해 주세요."
          error={showNicknameError ? "닉네임은 2자 이상 12자 이하여야 해요." : undefined}
          success={duplicateCheck.nickname.isAvailable ? "사용할 수 있는 닉네임이에요." : undefined}
        >
          <div className="flex gap-2">
            <input
              id="nickname"
              type="text"
              placeholder="닉네임"
              className={inputClass}
              value={form.nickname}
              disabled={duplicateCheck.nickname.isChecking}
              onChange={(e) => handleChangeField("nickname", e.target.value)}
            />
            <button
              type="button"
              className={secondaryButtonClass}
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
        </Field>

        <Field
          label="비밀번호"
          htmlFor="password"
          hint="영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상"
          error={
            showPasswordError ? "영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상이어야 해요." : undefined
          }
        >
          <input
            id="password"
            type="password"
            placeholder="비밀번호"
            className={inputClass}
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
          />
        </Field>

        <Field
          label="비밀번호 확인"
          htmlFor="passwordConfirm"
          error={showPasswordConfirmError ? "비밀번호가 일치하지 않아요." : undefined}
        >
          <input
            id="passwordConfirm"
            type="password"
            placeholder="비밀번호 확인"
            className={inputClass}
            value={form.passwordConfirm}
            onChange={(e) => handleChangeField("passwordConfirm", e.target.value)}
          />
        </Field>

        <button
          type="submit"
          className={primaryButtonClass}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-subtle">
        이미 계정이 있나요?{" "}
        <Link to="/login" className="font-bold text-brand">
          로그인
        </Link>
      </p>
    </AuthCard>
  );
}
