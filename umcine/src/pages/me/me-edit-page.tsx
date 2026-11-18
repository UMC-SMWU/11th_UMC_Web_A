import { useRef, useState } from "react";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";

// 8주차에서 내 정보 조회 API로 교체
const MOCK_ME = {
  nickname: "gs0428",
  email: "gwangsoo@cinemalab.kr",
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const inputClass =
  "h-12 w-full rounded-lg border bg-white px-4 text-[15px] text-ink outline-none transition placeholder:text-muted";
const labelClass = "mb-2 block text-sm font-bold text-ink";

export function MeEditPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState(MOCK_ME.nickname);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [nicknameCheck, setNicknameCheck] = useState({
    isChecking: false,
    isAvailable: false,
  });

  const trimmedNickname = nickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;
  const isNicknameChanged = trimmedNickname !== MOCK_ME.nickname;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;

  // 닉네임을 바꿨다면 중복 확인까지 통과해야 저장 가능
  const isNicknameReady =
    !isNicknameChanged || (isNicknameValid && nicknameCheck.isAvailable);
  const canSave =
    (isNicknameChanged || previewUrl !== null) &&
    isNicknameReady &&
    !nicknameCheck.isChecking;

  const handleChangeNickname = (value: string) => {
    if (nicknameCheck.isChecking) return;
    // 확인한 값을 바꾸면 다시 중복 확인해야 함
    setNicknameCheck({ isChecking: false, isAvailable: false });
    setNickname(value);
  };

  const handleCheckNickname = async () => {
    if (!isNicknameValid || !isNicknameChanged || nicknameCheck.isChecking) return;

    setNicknameCheck({ isChecking: true, isAvailable: false });
    try {
      const { available } = await checkNicknameDuplicate(trimmedNickname);
      setNicknameCheck({ isChecking: false, isAvailable: available });
      alert(available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.");
    } catch {
      setNicknameCheck({ isChecking: false, isAvailable: false });
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 같은 파일을 다시 골라도 onChange가 실행되도록 초기화
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있어요.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      alert("5MB 이하의 이미지만 선택할 수 있어요.");
      return;
    }

    // 이전 미리보기 URL은 메모리에서 해제
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!canSave) return;
    // 8주차에서 내 정보 수정 API 연결
    alert("변경사항 저장은 8주차에서 API와 연결해요.");
  };

  const handleWithdraw = () => {
    // 8주차 이후 회원 탈퇴 API 연결
    alert("회원 탈퇴는 아직 지원하지 않아요.");
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-91px)] w-full max-w-[1440px] flex-col px-20 pt-6 pb-7">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-ink">내 정보 수정</h1>
          <p className="mt-2 text-sm text-sub">
            닉네임과 프로필 이미지만 변경할 수 있어요.
          </p>
        </div>
        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          className="mt-3 flex h-[42px] items-center rounded-lg bg-primary px-4 text-sm font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
        >
          변경사항 저장
        </button>
      </div>

      <div className="mt-9 grid grid-cols-2">
        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center pt-3">
          <button
            type="button"
            aria-label="프로필 이미지 변경"
            onClick={() => fileInputRef.current?.click()}
            className="relative size-[82px]"
          >
            <span className="flex size-full items-center justify-center overflow-hidden rounded-full bg-line">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="프로필 이미지 미리보기"
                  className="size-full object-cover"
                />
              ) : (
                <img
                  src="/icons/movie-icons/person.svg"
                  alt=""
                  aria-hidden="true"
                  className="size-12"
                />
              )}
            </span>
            <span className="absolute -right-1 -bottom-1 rounded-full bg-white">
              <img
                src="/icons/movie-icons/edit.svg"
                alt=""
                aria-hidden="true"
                className="size-6"
              />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChangeImage}
            className="hidden"
          />
          <p className="mt-2 text-sm font-bold text-ink">프로필 이미지</p>
          <p className="mt-1 text-[11px] text-muted">선택 사항 · 최대 5MB</p>
        </div>

        {/* 닉네임, 이메일 */}
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="nickname" className={labelClass}>
              닉네임
            </label>
            <div className="relative">
              <input
                id="nickname"
                placeholder="2~12자"
                value={nickname}
                disabled={nicknameCheck.isChecking}
                onChange={(e) => handleChangeNickname(e.target.value)}
                className={`${inputClass} pr-24 ${
                  showNicknameError
                    ? "border-red-500"
                    : "border-line focus:border-primary"
                }`}
              />
              <button
                type="button"
                disabled={
                  !isNicknameValid || !isNicknameChanged || nicknameCheck.isChecking
                }
                onClick={handleCheckNickname}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-[13px] font-bold text-primary disabled:text-muted"
              >
                {nicknameCheck.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showNicknameError && (
              <p className="mt-1.5 text-xs text-red-500">
                닉네임은 2~12자로 입력해 주세요.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              이메일
            </label>
            {/* 이메일은 변경할 수 없어 읽기 전용 */}
            <input
              id="email"
              type="email"
              value={MOCK_ME.email}
              readOnly
              className={`${inputClass} border-line`}
            />
          </div>
        </div>
      </div>

      {/* 회원 탈퇴 */}
      <section className="mt-auto flex items-center justify-between rounded-[10px] border border-danger bg-danger/10 px-5 py-5">
        <div>
          <h2 className="text-sm font-bold text-danger">회원 탈퇴</h2>
          <p className="mt-1.5 text-[11px] text-danger">
            탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleWithdraw}
          className="flex h-[42px] items-center rounded-lg border border-danger bg-white px-4 text-sm font-extrabold text-danger"
        >
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}