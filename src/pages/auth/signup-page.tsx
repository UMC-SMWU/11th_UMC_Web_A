import { useState } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 영문 대소문자, 숫자, 특수문자를 모두 포함한 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

// 회원가입 기본 입력값
const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

// 중복 확인 기본 상태
const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";
type DefaultFormKey = keyof typeof DEFAULT_FORM;

export function SignupPage() {
  // 입력값 상태 관리
  const [form, setForm] = useState(DEFAULT_FORM);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이메일, 닉네임 중복 확인 상태 관리
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: { ...DEFAULT_DUPLICATE_CHECK },
    nickname: { ...DEFAULT_DUPLICATE_CHECK },
  });

  // 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());

  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;

  const isPasswordValid = PASSWORD_REGEX.test(form.password);

  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 오류 메시지 표시 여부
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 전체 입력값 유효성 검사
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  // 입력값 검사 + 이메일·닉네임 중복 확인
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  // 입력값 변경 처리
  const handleChangeField = (key: DefaultFormKey, value: string) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;

      // 이메일이나 닉네임을 수정하면 중복 확인 결과 초기화
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...DEFAULT_DUPLICATE_CHECK },
      }));
    }

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 이메일·닉네임 중복 확인 API 요청
  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;

    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";

    // 요청 시작
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

      // 요청 성공
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
      // 요청 실패
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));

      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      // 요청 종료
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  // 회원가입 제출
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
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
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-90px)] items-center justify-center px-5 py-12">
      <div className="w-full max-w-[420px]">
        {/* 회원가입 제목 */}
        <h1 className="mb-6 text-3xl font-bold text-gray-900">회원가입</h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5"
        >
          {/* 이메일 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-gray-900"
            >
              이메일
            </label>

            <div className="flex h-12 overflow-hidden rounded-md border border-gray-200 bg-white focus-within:border-indigo-500">
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
                placeholder="name@example.com"
                disabled={duplicateCheck.email.isChecking}
                className="min-w-0 flex-1 px-3 text-sm outline-none placeholder:text-gray-400 disabled:bg-gray-50"
              />

              <button
                type="button"
                disabled={!isEmailValid || duplicateCheck.email.isChecking}
                onClick={() => handleCheckDuplicate("email")}
                className="shrink-0 px-4 text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>

            {showEmailError && (
              <p className="text-xs text-red-500">
                올바른 이메일 형식을 입력해 주세요.
              </p>
            )}

            {duplicateCheck.email.isAvailable && (
              <p className="text-xs text-green-600">
                사용 가능한 이메일입니다.
              </p>
            )}
          </div>

          {/* 닉네임 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="nickname"
              className="text-sm font-semibold text-gray-900"
            >
              닉네임
            </label>

            <div className="flex h-12 overflow-hidden rounded-md border border-gray-200 bg-white focus-within:border-indigo-500">
              <input
                id="nickname"
                type="text"
                value={form.nickname}
                onChange={(e) => handleChangeField("nickname", e.target.value)}
                placeholder="2~12자"
                disabled={duplicateCheck.nickname.isChecking}
                className="min-w-0 flex-1 px-3 text-sm outline-none placeholder:text-gray-400 disabled:bg-gray-50"
              />

              <button
                type="button"
                disabled={
                  !isNicknameValid || duplicateCheck.nickname.isChecking
                }
                onClick={() => handleCheckDuplicate("nickname")}
                className="shrink-0 px-4 text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>

            {showNicknameError && (
              <p className="text-xs text-red-500">
                닉네임은 2~12자여야 합니다.
              </p>
            )}

            {duplicateCheck.nickname.isAvailable && (
              <p className="text-xs text-green-600">
                사용 가능한 닉네임입니다.
              </p>
            )}
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
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              placeholder="8자 이상"
              className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none placeholder:text-gray-400 focus:border-indigo-500"
            />

            <p
              className={`text-xs ${showPasswordError ? "text-red-500" : "text-gray-400"}`}
            >
              영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해
              주세요.
            </p>
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="passwordConfirm"
              className="text-sm font-semibold text-gray-900"
            >
              비밀번호 확인
            </label>

            <input
              id="passwordConfirm"
              type="password"
              value={form.passwordConfirm}
              onChange={(e) =>
                handleChangeField("passwordConfirm", e.target.value)
              }
              placeholder="다시 입력"
              className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none placeholder:text-gray-400 focus:border-indigo-500"
            />

            {showPasswordConfirmError && (
              <p className="text-xs text-red-500">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          {/* 가입하기 버튼 */}
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="mt-1 h-12 w-full rounded-md bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </form>

        {/* 로그인 페이지 이동 */}
        <p className="mt-4 text-center text-xs text-gray-400">
          이미 계정이 있나요?{" "}
          <a
            href="/login"
            className="font-semibold text-indigo-600 hover:underline"
          >
            로그인
          </a>
        </p>
      </div>
    </div>
  );
}
