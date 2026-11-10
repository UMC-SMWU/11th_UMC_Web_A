import { Link } from "@tanstack/react-router";

// 임시 사용자 데이터 (8주차에서 API 연결 예정)
const mockUser = {
  email: "umcine@example.com",
  nickname: "UMCine",
};

export function MyPage() {
  return (
    <div className="flex min-h-[calc(100vh-90px)] items-center justify-center px-5 py-12">
      <div className="w-full max-w-[420px]">
        {/* 페이지 제목 */}
        <h1 className="mb-8 text-3xl font-bold text-gray-900">내 정보</h1>

        {/* 프로필 이미지 */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-4xl font-bold text-indigo-600">
            {mockUser.nickname.charAt(0)}
          </div>

          <p className="text-lg font-semibold text-gray-900">
            {mockUser.nickname}
          </p>
        </div>

        {/* 이메일 */}
        <div className="mb-5 flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">이메일</label>

          <div className="flex h-12 items-center rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-500">
            {mockUser.email}
          </div>
        </div>

        {/* 닉네임 */}
        <div className="mb-7 flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-900">닉네임</label>

          <div className="flex h-12 items-center rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-500">
            {mockUser.nickname}
          </div>
        </div>

        {/* 수정 페이지 이동 */}
        <Link
          to="/my/edit"
          className="flex h-12 w-full items-center justify-center rounded-md bg-indigo-600 text-sm font-semibold text-white"
        >
          내 정보 수정
        </Link>
      </div>
    </div>
  );
}
