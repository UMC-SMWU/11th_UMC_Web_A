import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import {
  AuthCard,
  Field,
  inputClass,
  primaryButtonClass,
} from "../../components/auth/auth-form-parts";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const showEmailError = email.length > 0 && !isEmailValid;
  const canSubmit = isEmailValid && password.length > 0;

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 로그인 API 연동은 8주차에서 해요. 이번 주차는 화면만 만들어요.
  };

  return (
    <AuthCard title="로그인">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Field
          label="이메일"
          htmlFor="login-email"
          error={showEmailError ? "올바른 이메일 형식이 아니에요." : undefined}
        >
          <input
            id="login-email"
            type="email"
            placeholder="example@umc.com"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field label="비밀번호" htmlFor="login-password">
          <input
            id="login-password"
            type="password"
            placeholder="비밀번호"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <button type="submit" className={primaryButtonClass} disabled={!canSubmit}>
          로그인
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-subtle">
        아직 계정이 없나요?{" "}
        <Link to="/signup" className="font-bold text-brand">
          회원가입
        </Link>
      </p>
    </AuthCard>
  );
}
