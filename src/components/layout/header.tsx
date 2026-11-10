import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

const navItemClass = "text-sm font-medium text-subtle md:text-[15px]";
const navItemActiveClass = "font-bold text-ink";

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isMovieActive = pathname === "/" || pathname.startsWith("/movies");
  const isSearchActive = pathname.startsWith("/search");
  const isMyActive = pathname.startsWith("/me");

  return (
    <header className="flex h-[91px] w-full items-center justify-between border-b border-line bg-white px-4 py-6 md:px-20">
      <div className="flex items-center gap-3 md:gap-10">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-ink">
          <img className="size-7" src="/icons/logo.svg" alt="UMCine" />
          <span className="hidden sm:inline">UMCine</span>
        </Link>
        <nav className="flex items-center gap-3 md:gap-7">
          <Link
            to="/"
            aria-current={isMovieActive ? "page" : undefined}
            className={cn(navItemClass, isMovieActive && navItemActiveClass)}
          >
            영화
          </Link>
          <Link
            to="/search"
            aria-current={isSearchActive ? "page" : undefined}
            className={cn(navItemClass, isSearchActive && navItemActiveClass)}
          >
            검색
          </Link>
          <Link
            to="/me"
            aria-current={isMyActive ? "page" : undefined}
            className={cn(navItemClass, isMyActive && navItemActiveClass)}
          >
            내 정보
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/search"
          aria-label="검색"
          className="hidden size-9 items-center justify-center sm:flex"
        >
          <img className="size-5" src="/icons/search.svg" alt="" />
        </Link>
        <Link
          to="/login"
          className="flex h-10 items-center rounded-lg bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover"
        >
          로그인
        </Link>
      </div>
    </header>
  );
}
