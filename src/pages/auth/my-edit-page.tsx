import { useEffect, useState } from "react";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function MyEditPage() {
  const [nickname, setNickname] = useState("gs0428");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (!image) return;

    const url = URL.createObjectURL(image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  return (
    <main className="bg-[#f5f6f8] text-[#19191f]">
      <div className="mx-auto flex min-h-[calc(100dvh-80px)] max-w-[1200px] flex-col px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">내 정보 수정</h1>
            <p className="mt-2 text-sm text-gray-500">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="button"
            disabled
            className="rounded-lg bg-[#485cde] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            변경사항 저장
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
                  setImage(file);
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
                  onChange={(e) => setNickname(e.target.value)}
                  className="min-w-0 flex-1 text-sm outline-none"
                />
                <button
                  type="button"
                  disabled
                  className="shrink-0 text-xs font-semibold text-[#485cde]"
                >
                  중복 확인
                </button>
              </div>
            </div>

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
                value="example@cinemalab.kr"
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
      </div>
    </main>
  );
}
