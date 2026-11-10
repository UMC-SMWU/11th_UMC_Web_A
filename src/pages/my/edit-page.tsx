import { useRef, useState, type ChangeEvent } from "react";
import { Link } from "@tanstack/react-router";

export function EditPage() {
  // 7주차 미션용 임시 사용자 정보
  const [nickname, setNickname] = useState("gs0428");
  const [savedNickname, setSavedNickname] = useState("gs0428");
  const [email] = useState("gwangsoo@cinemalab.kr");

  // 프로필 이미지 상태
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 닉네임 중복 확인 상태
  const [isNicknameChecked, setIsNicknameChecked] = useState(true);

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    setIsNicknameChecked(false);
  };

  const handleCheckNickname = () => {
    if (nickname.trim().length < 2 || nickname.trim().length > 12) {
      alert("닉네임은 2~12자로 입력해 주세요.");
      return;
    }

    // 이번 주차는 UI 테스트용
    // 실제 중복 여부는 8주차 API에서 확인
    setIsNicknameChecked(true);
    alert("닉네임 확인 완료! (UI 테스트)");
  };

  // 프로필 이미지 미리보기
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있습니다.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  // 변경사항 저장 (프론트엔드 테스트)
  const handleSave = () => {
    if (!isNicknameChecked) {
      alert("닉네임 중복 확인을 먼저 해주세요.");
      return;
    }

    setSavedNickname(nickname.trim());
    alert("변경사항이 저장되었습니다. (UI 테스트)");
  };

  const handleWithdraw = () => {
    alert("회원 탈퇴 기능은 아직 연결되지 않았습니다.");
  };

  return (
    <div className="min-h-[calc(100vh-86px)] bg-[#F7F8FA]">
      <div className="mx-auto flex min-h-[calc(100vh-86px)] w-full max-w-[1440px] flex-col px-10 py-8 md:px-20">
        {/* 상단 제목 및 저장 버튼 */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-[#171717]">
              내 정보 수정
            </h1>

            <p className="mt-2 text-[13px] text-[#8A8F98]">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-[#4F6DF5] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#405BE0]"
          >
            변경사항 저장
          </button>
        </div>

        {/* 프로필 수정 영역 */}
        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.1fr]">
          {/* 왼쪽: 프로필 이미지 */}
          <div className="flex flex-col items-center pt-4">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#E5E7EB]">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="프로필 이미지"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-14 w-14 fill-[#20242A]"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21v-2c0-4 3.5-6 8-6s8 2 8 6v2H4z" />
                  </svg>
                )}
              </div>

              {/* 이미지 변경 버튼 */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="프로필 이미지 변경"
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#F7F8FA] text-[#222] shadow-sm"
              >
                ✎
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <p className="mt-5 text-[15px] font-semibold text-[#222]">
              프로필 이미지
            </p>

            <p className="mt-1 text-[12px] text-[#9CA3AF]">
              선택 사항 · 최대 5MB
            </p>

            <p className="mt-3 text-xs text-[#8A8F98]">
              현재 닉네임: {savedNickname}
            </p>
          </div>

          {/* 오른쪽: 정보 수정 */}
          <div className="flex flex-col gap-7">
            {/* 닉네임 */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="edit-nickname"
                className="text-[14px] font-semibold text-[#222]"
              >
                닉네임
              </label>

              <div className="flex h-12 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white focus-within:border-[#4F6DF5]">
                <input
                  id="edit-nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => handleNicknameChange(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  className="min-w-0 flex-1 px-4 text-[14px] text-[#333] outline-none"
                />

                <button
                  type="button"
                  onClick={handleCheckNickname}
                  className="shrink-0 px-4 text-[12px] font-semibold text-[#4F6DF5] hover:text-[#405BE0]"
                >
                  중복 확인
                </button>
              </div>

              {nickname.length > 0 &&
                (nickname.trim().length < 2 || nickname.trim().length > 12) && (
                  <p className="text-xs text-red-500">
                    닉네임은 2~12자로 입력해 주세요.
                  </p>
                )}

              {isNicknameChecked && (
                <p className="text-xs text-green-600">닉네임 확인 완료</p>
              )}
            </div>

            {/* 이메일 */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="edit-email"
                className="text-[14px] font-semibold text-[#222]"
              >
                이메일
              </label>

              <input
                id="edit-email"
                type="email"
                value={email}
                readOnly
                className="h-12 w-full cursor-not-allowed rounded-lg border border-[#E5E7EB] bg-white px-4 text-[14px] text-[#555] outline-none"
              />
            </div>
          </div>
        </div>

        {/* 빈 공간을 채워 하단에 탈퇴 영역 배치 */}
        <div className="min-h-24 flex-1" />

        {/* 회원 탈퇴 영역 */}
        <div className="mt-12 flex flex-col gap-4 rounded-xl border border-[#F87171] bg-[#FFF0F0] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[14px] font-semibold text-[#E53935]">
              회원 탈퇴
            </p>

            <p className="mt-1 text-[12px] text-[#EF5350]">
              탈퇴하면 작성한 리뷰, 즐겨찾기 등 모든 서비스 정보가 삭제될 수
              있습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={handleWithdraw}
            className="shrink-0 self-start rounded-lg border border-[#EF5350] bg-white px-4 py-2 text-[13px] font-semibold text-[#E53935] hover:bg-red-50"
          >
            회원 탈퇴
          </button>
        </div>

        {/* 내 정보 조회 페이지로 이동 */}
        <div className="mt-5 text-right">
          <Link to="/my" className="text-sm text-[#8A8F98] hover:underline">
            내 정보로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
