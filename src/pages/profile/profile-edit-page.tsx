import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import type { MemberInfo } from "../../api/members/me";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { ProfileAvatar } from "../../components/profile/profile-avatar";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { cn } from "../../utils/cn";
import { useMeQuery } from "../../hooks/use-me-query";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function ProfileEditPage() {
  const meQuery = useMeQuery();

  if (meQuery.isPending) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-[#999999]">내 정보를 불러오는 중이에요.</p>
      </main>
    );
  }

  if (meQuery.isError) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-[#999999]">내 정보를 불러오지 못했어요.</p>
      </main>
    );
  }

  return <ProfileEditForm member={meQuery.data} />;
}

function ProfileEditForm({ member }: { member: MemberInfo }) {
  const savedNickname = member.nickname;

  const [nickname, setNickname] = useState(savedNickname);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [duplicateCheck, setDuplicateCheck] = useState({
    isChecking: false,
    isAvailable: false,
  });
  const updateMeMutation = useUpdateMeMutation();

  const trimmedNickname = nickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const isNicknameChanged = trimmedNickname !== savedNickname;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;

  // 닉네임을 바꿨다면 중복 확인까지 통과해야 저장 가능
  const canSubmit =
    isNicknameValid && (!isNicknameChanged || duplicateCheck.isAvailable);

  const handleNicknameChange = (value: string) => {
    if (duplicateCheck.isChecking) return;
    setNickname(value);
    setDuplicateCheck({ isChecking: false, isAvailable: false }); // 값이 바뀌면 재확인
  };

  const handleCheckDuplicate = async () => {
    if (!isNicknameValid || !isNicknameChanged || duplicateCheck.isChecking)
      return;

    setDuplicateCheck({ isChecking: true, isAvailable: false });
    try {
      const response = await checkNicknameDuplicate(trimmedNickname);
      setDuplicateCheck({ isChecking: false, isAvailable: response.available });
      alert(
        response.available
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      setDuplicateCheck({ isChecking: false, isAvailable: false });
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      alert("프로필 이미지는 최대 5MB까지 올릴 수 있어요.");
      e.target.value = "";
      return;
    }
    setImageUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file); // 미리보기
    });
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate({ nickname: trimmedNickname });
  };

  const handleWithdraw = () => {
    if (!window.confirm("정말 탈퇴할까요? 복구할 수 없어요.")) return;
    // 회원 탈퇴 API는 이후 단계에서 연결
  };

  return (
    <main className="bg-[#f7f7f8] px-10 pb-16 pt-10">
      <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#111111]">내 정보 수정</h1>
            <p className="mt-2 text-sm text-[#6b7280]">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="submit"
            disabled={!canSubmit || updateMeMutation.isPending}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {updateMeMutation.isPending ? "저장 중" : "변경사항 저장"}
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center gap-1">
            <label htmlFor="profile-image" className="relative cursor-pointer">
              <ProfileAvatar imageUrl={imageUrl} className="h-32 w-32" />
              <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#111111] bg-white">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                </svg>
              </span>
            </label>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
            <p className="mt-3 font-bold text-[#111111]">프로필 이미지</p>
            <p className="text-xs text-[#9ca3af]">선택 사항 · 최대 5MB</p>
          </div>

          {/* 닉네임, 이메일 */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="nickname"
                className="text-sm font-bold text-[#111111]"
              >
                닉네임
              </label>
              <div className="relative">
                <input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => handleNicknameChange(e.target.value)}
                  aria-invalid={showNicknameError}
                  className={cn(
                    "h-12 w-full rounded-xl border bg-white px-4 pr-24 text-sm outline-none focus:border-blue-600",
                    showNicknameError ? "border-red-500" : "border-[#e5e7eb]",
                  )}
                />
                <button
                  type="button"
                  disabled={
                    !isNicknameValid ||
                    !isNicknameChanged ||
                    duplicateCheck.isChecking
                  }
                  onClick={handleCheckDuplicate}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-sm font-bold text-blue-600 disabled:cursor-not-allowed disabled:text-blue-300"
                >
                  {duplicateCheck.isChecking ? "확인 중" : "중복 확인"}
                </button>
              </div>
              {showNicknameError && (
                <p className="text-xs text-red-500">
                  닉네임은 2자 이상 12자 이하로 입력해 주세요.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-bold text-[#111111]"
              >
                이메일
              </label>
              <input
                id="email"
                value={member.email}
                readOnly
                className="h-12 w-full rounded-xl border border-[#e5e7eb] bg-white px-4 text-sm outline-none"
              />
            </div>
          </div>
        </div>
      </form>

      {/* 회원 탈퇴 */}
      <section className="mx-auto mt-40 flex max-w-6xl items-center justify-between rounded-xl border border-red-500 bg-red-50 px-8 py-6">
        <div>
          <h2 className="font-bold text-red-600">회원 탈퇴</h2>
          <p className="mt-1 text-xs text-red-600">
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수
            없습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleWithdraw}
          className="rounded-lg border border-red-500 bg-white px-6 py-3 text-sm font-bold text-red-600"
        >
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}