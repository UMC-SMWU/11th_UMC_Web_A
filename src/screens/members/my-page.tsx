"use client";

import { useState, type SubmitEvent } from "react";
import {
  AuthCard,
  Field,
  inputClass,
  primaryButtonClass,
} from "../../components/auth/auth-form-parts";
import { StatusMessage } from "../../components/common/status-message";
import { MovieTitle } from "../../components/movies/movie-title";
import { useFavoritesQuery } from "../../hooks/use-favorites";
import { useMeQuery } from "../../hooks/use-me-query";
import { useMyRatingsQuery } from "../../hooks/use-ratings";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";

export function MyPage() {
  const meQuery = useMeQuery();
  const favoritesQuery = useFavoritesQuery();
  const ratingsQuery = useMyRatingsQuery();
  const updateMeMutation = useUpdateMeMutation();
  // null이면 서버 값을 보여 주고, 입력을 시작하면 입력값을 써요.
  const [nicknameInput, setNicknameInput] = useState<string | null>(null);

  if (meQuery.isLoading) {
    return (
      <AuthCard title="내 정보">
        <StatusMessage>내 정보를 불러오는 중이에요.</StatusMessage>
      </AuthCard>
    );
  }

  if (meQuery.isError || !meQuery.data) {
    return (
      <AuthCard title="내 정보">
        <StatusMessage tone="error">내 정보를 불러오지 못했어요.</StatusMessage>
      </AuthCard>
    );
  }

  const member = meQuery.data;
  const nickname = (nicknameInput ?? member.nickname).trim();
  const isNicknameValid = nickname.length >= 2 && nickname.length <= 12;
  const showNicknameError = nicknameInput !== null && nicknameInput.length > 0 && !isNicknameValid;
  const canSave = isNicknameValid && nickname !== member.nickname;

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSave || updateMeMutation.isPending) return;
    updateMeMutation.mutate({ nickname }, { onSuccess: () => setNicknameInput(null) });
  };

  return (
    <AuthCard title="내 정보">
      <section className="mb-8 rounded-xl bg-surface p-4">
        <p className="text-xs text-muted">현재 닉네임</p>
        <p className="mt-1 text-lg font-extrabold text-ink">{member.nickname}</p>
      </section>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Field label="이메일" htmlFor="my-email">
          <input id="my-email" className={inputClass} value={member.email} disabled readOnly />
        </Field>

        <Field label="가입일" htmlFor="my-created-at">
          <input
            id="my-created-at"
            className={inputClass}
            value={member.createdAt.slice(0, 10)}
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
            value={nicknameInput ?? member.nickname}
            onChange={(e) => setNicknameInput(e.target.value)}
          />
        </Field>

        <button
          type="submit"
          className={primaryButtonClass}
          disabled={!canSave || updateMeMutation.isPending}
        >
          {updateMeMutation.isPending ? "저장 중" : "저장하기"}
        </button>
      </form>

      <section className="mt-10">
        <h2 className="text-lg font-extrabold text-ink">즐겨찾기</h2>
        {favoritesQuery.isError ? (
          <p className="mt-3 text-sm text-muted">즐겨찾기를 불러오지 못했어요.</p>
        ) : favoritesQuery.data?.length ? (
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {favoritesQuery.data.map((favorite) => (
              <li key={favorite.movieId}>
                <MovieTitle movieId={favorite.movieId} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted">즐겨찾기한 영화가 없어요.</p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-extrabold text-ink">내 평점</h2>
        {ratingsQuery.isError ? (
          <p className="mt-3 text-sm text-muted">평점을 불러오지 못했어요.</p>
        ) : ratingsQuery.data?.length ? (
          <ul className="mt-3 flex flex-col gap-3 text-sm">
            {ratingsQuery.data.map((rating) => (
              <li key={rating.ratingId}>
                <MovieTitle movieId={rating.movieId} />
                <span className="ml-2 text-brand">★ {rating.score}</span>
                {rating.comment ? <p className="mt-1 text-subtle">{rating.comment}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted">등록한 평점이 없어요.</p>
        )}
      </section>
    </AuthCard>
  );
}
