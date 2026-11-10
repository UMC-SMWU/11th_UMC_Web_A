import { useState, type SubmitEvent } from "react";
import {
  AuthCard,
  Field,
  inputClass,
  primaryButtonClass,
} from "../../components/auth/auth-form-parts";

// 내 정보 조회/수정 API 연동은 8주차에서 해요. 이번 주차는 화면만 만들고 예시 값을 보여 줘요.
const SAMPLE_MEMBER = {
  email: "movie@umc.com",
  nickname: "영화광",
  createdAt: "2026-09-02",
};

export function MyPage() {
  const [savedNickname, setSavedNickname] = useState(SAMPLE_MEMBER.nickname);
  const [nickname, setNickname] = useState(SAMPLE_MEMBER.nickname);

  const trimmed = nickname.trim();
  const isNicknameValid = trimmed.length >= 2 && trimmed.length <= 12;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;
  // 값이 바뀌고 조건을 만족할 때만 저장할 수 있어요.
  const canSave = isNicknameValid && trimmed !== savedNickname;

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSave) return;
    setSavedNickname(trimmed);
    setNickname(trimmed);
  };

  return (
    <AuthCard title="내 정보">
      <section className="mb-8 rounded-xl bg-surface p-4">
        <p className="text-xs text-muted">현재 닉네임</p>
        <p className="mt-1 text-lg font-extrabold text-ink">{savedNickname}</p>
      </section>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Field label="이메일" htmlFor="my-email">
          <input id="my-email" className={inputClass} value={SAMPLE_MEMBER.email} disabled readOnly />
        </Field>

        <Field label="가입일" htmlFor="my-created-at">
          <input
            id="my-created-at"
            className={inputClass}
            value={SAMPLE_MEMBER.createdAt}
            disabled
            readOnly
          />
        </Field>

        <Field
          label="닉네임"
          htmlFor="my-nickname"
          hint="2자 이상 12자 이하로 입력해 주세요."
          error={showNicknameError ? "닉네임은 2자 이상 12자 이하여야 해요." : undefined}
        >
          <input
            id="my-nickname"
            type="text"
            className={inputClass}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </Field>

        <button type="submit" className={primaryButtonClass} disabled={!canSave}>
          저장하기
        </button>
      </form>
    </AuthCard>
  );
}
