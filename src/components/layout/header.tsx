import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-[#eeeeee] bg-white px-10 py-4">
      <div className="flex items-center gap-10">
        <div className="text-lg font-bold text-[#111111]">🎬 UMCine</div>
        <nav className="flex gap-6">
          <Link to="/" className="text-[15px] font-medium text-[#666666] hover:text-[#111111]">
            영화
          </Link>
          <Link to="/search" className="text-[15px] font-medium text-[#666666] hover:text-[#111111]">
            검색
          </Link>
          <a href="#" className="text-[15px] font-medium text-[#666666] hover:text-[#111111]">
            내 정보
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Link
          to="/search"
          aria-label="검색"
          className="rounded-md border border-[#dddddd] bg-white px-3 py-2"
        >
          🔍
        </Link>
        <button
          type="button"
          className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white"
        >
          로그인
        </button>
      </div>
    </header>
  );
}