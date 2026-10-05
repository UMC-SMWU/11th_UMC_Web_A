import { Link } from "@tanstack/react-router";

function Header() {
  return (
    <header className="w-full border-b border-[#eeeeee] bg-white">
      <div className="mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between px-3 sm:gap-6 sm:px-4">
        {/* 왼쪽: 로고 + nav */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-[42px]">
          <h1 className="m-0 flex shrink-0 items-center gap-2 whitespace-nowrap text-xl font-bold text-black sm:text-2xl">
            <img
              src="/icons/movie.svg"
              alt=""
              className="block h-10 w-10 rounded-lg border-2 border-black p-1"
            />
            UMCine
          </h1>

          <nav className="flex shrink-0 items-center gap-3 sm:gap-8">
            <Link
              to="/"
              className="text-base font-medium text-black underline-offset-2"
              activeOptions={{ exact: true }}
              activeProps={{ className: "underline" }}
            >
              영화
            </Link>

            <Link
              to="/search"
              className="text-base font-medium text-black underline-offset-2"
              activeProps={{ className: "underline" }}
            >
              검색
            </Link>

            {/* <Link to="/search">내 정보</Link> */}
          </nav>
        </div>

        {/* 오른쪽: 검색 + 로그인 */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link
            to="/search"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dddddd]"
          >
            <img src="/icons/search.svg" alt="검색" className="h-5 w-5" />
          </Link>

          <button
            type="button"
            className="h-10 shrink-0 cursor-pointer whitespace-nowrap rounded-lg border-none bg-[#2563eb] px-3 text-sm font-medium text-white sm:px-5"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
