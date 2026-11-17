import { useEffect, useState } from "react";
import { useUpdateMeMutation } from "@/hooks/use-update-me-mutation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function MyEditPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [editedNickname, setEditedNickname] = useState<string | null>(null);
  const [checkedNickname, setCheckedNickname] = useState<string | null>(null);
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 30_000,
  });

  const email = profile?.email ?? "";
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");

  const updateMeMutation = useUpdateMeMutation();

  const nickname = editedNickname ?? profile?.nickname ?? "";
  const trimmedNickname = nickname.trim();
  const isNicknameUnchanged = trimmedNickname !== profile?.nickname;

  const canSubmit =
    Boolean(accessToken && profile) &&
    trimmedNickname.length >= 2 &&
    trimmedNickname.length <= 12 &&
    (isNicknameUnchanged || checkedNickname === trimmedNickname) &&
    !isCheckingNickname;

  const handleCheckNickname = async () => {
    const targetNickname = trimmedNickname;

    if (targetNickname.length < 2 || targetNickname.length > 12) {
      setNicknameMessage("닉네임은 2자 이상 12자 이하로 입력해 주세요.");
      return;
    }

    setIsCheckingNickname(true);
    setCheckedNickname(null);
    setNicknameMessage("");

    try {
      const result = await checkNicknameDuplicate(targetNickname);

      if (result.available) {
        setCheckedNickname(targetNickname);
        setNicknameMessage("사용 가능한 닉네임이에요.");
      } else {
        setNicknameMessage(
          "이미 사용 중인 닉네임이에요. 다른 닉네임을 입력해 주세요.",
        );
      }
    } catch {
      setNicknameMessage(
        "닉네임 확인 중 오류가 발생했습니다. 다시 시도해 주세요.",
      );
    } finally {
      setIsCheckingNickname(false);
    }
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate({ nickname: trimmedNickname });
  };

  useEffect(() => {
    if (!preview) return;

    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  return (
    <main className="bg-[#f5f6f8] text-[#19191f]">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex min-h-[calc(100dvh-80px)] max-w-[1200px] flex-col px-4 py-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">내 정보 수정</h1>
            <p className="mt-2 text-sm text-gray-500">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white"
            disabled={!canSubmit || updateMeMutation.isPending}
          >
            {updateMeMutation.isPending ? "저장 중" : "저장"}
          </button>
        </div>

        <div className="mt-8 grid items-start gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center md:pt-5">
            <label className="flex cursor-pointer flex-col items-center">
              <input
                type="file"
                accept="image/*"
                className="peer sr-only"
                aria-describedby="profile-image-help"
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  e.currentTarget.value = "";
                  if (!file) return;

                  if (
                    !file.type.startsWith("image/") ||
                    file.size > MAX_IMAGE_SIZE
                  ) {
                    setImageError("5MB 이하의 이미지 파일을 선택해 주세요.");
                    return;
                  }

                  setImageError("");
                  setPreview(URL.createObjectURL(file));
                }}
              />
              <span className="relative grid size-20 place-items-center rounded-full bg-[#E3E6EB] peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500">
                <img
                  src={preview ?? "/icons/person.svg"}
                  alt=""
                  className={
                    preview ? "size-full rounded-full object-cover" : "size-9"
                  }
                />
                <img
                  src="/icons/edit.svg"
                  alt=""
                  className="absolute right-0 bottom-0 size-7 rounded-full p-1"
                />
              </span>
              <span className="mt-2 text-sm font-semibold">프로필 이미지</span>
            </label>
            <p id="profile-image-help" className="mt-1 text-xs text-[#969DA8]">
              선택 사항 · 최대 5MB
            </p>
            {imageError && (
              <p role="alert" className="mt-2 text-xs text-red-600">
                {imageError}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="nickname"
                className="mb-2 block text-sm font-semibold"
              >
                닉네임
              </label>
              <div className="flex h-12 items-center gap-2 rounded-lg border border-[#E3E6EB] bg-white px-4 focus-within:border-indigo-500">
                <input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => {
                    setEditedNickname(e.target.value);
                    setCheckedNickname(null);
                    setNicknameMessage("");
                  }}
                  className="min-w-0 flex-1 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={handleCheckNickname}
                  disabled={isCheckingNickname}
                  className="shrink-0 text-xs font-semibold text-[#485cde]"
                >
                  {isCheckingNickname ? "확인 중..." : "중복 확인"}
                </button>
              </div>
            </div>

            {nicknameMessage && (
              <p
                role="status"
                className={`mt-2 text-xs ${
                  checkedNickname === trimmedNickname
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {nicknameMessage}
              </p>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                readOnly
                className="h-12 w-full rounded-lg border border-[#E3E6EB] bg-white px-4 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-12">
          <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-red-600 bg-red-50 p-5 text-red-700">
            <div>
              <h2 className="text-sm font-bold">회원 탈퇴</h2>
              <p className="mt-1 text-xs">
                탈퇴하면 작성한 평점, 후기와 즐겨찾기를 복구할 수 없어요.
              </p>
            </div>
            <button
              type="button"
              disabled
              className="rounded-lg border border-red-600 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
            >
              회원 탈퇴
            </button>
          </section>
        </div>
      </form>
    </main>
  );
}
