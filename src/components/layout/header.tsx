import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export default function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isMoviePage = pathname === "/" || pathname.startsWith("/movies/");

  const isSearchPage = pathname === "/search";

  return (
    <header className="flex h-[86px] w-full items-center justify-between bg-white px-20">
      <div className="flex items-center gap-[42px]">
        <div className="flex items-center gap-[6px]">
          <div className="flex h-8 w-8 items-center justify-center rounded-[6px] border-2 border-[#111]">
            <img src="/icons/movie.svg" alt="" className="h-6 w-6" />
          </div>

          <span className="text-[20px] font-black leading-5 tracking-[-0.7px] text-[#111]">
            UMCine
          </span>
        </div>

        <nav className="flex items-center gap-[30px]">
          <Link
            to="/"
            className={cn(
              "text-[14px] font-bold text-[#606774] no-underline",
              isMoviePage && "border-b-2 border-black text-[#111]",
            )}
          >
            영화
          </Link>

          <Link
            to="/search"
            className={cn(
              "text-[14px] font-bold text-[#606774] no-underline",
              isSearchPage && "border-b-2 border-black text-[#111]",
            )}
          >
            검색
          </Link>

          <Link
            to="/"
            className="text-[14px] font-bold text-[#606774] no-underline"
          >
            내 정보
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[#ddd] bg-white"
        >
          <img src="/icons/search.svg" alt="검색" className="h-6 w-6" />
        </button>

        <button
          type="button"
          className="h-10 rounded-lg bg-[#4F6DF5] px-4 font-semibold text-white"
        >
          로그인
        </button>
      </div>
    </header>
  );
}
