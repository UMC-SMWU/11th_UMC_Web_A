import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

const MENUS = [
  { label: "영화", to: "/" },
  { label: "검색", to: "/search" },
] as const;

export function Header() {
  return (
    <header className="flex h-[91px] items-center justify-between bg-white px-20 py-6">
      <div className="flex items-center gap-[42px]">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border-2 border-ink">
            <img src="/icons/movie-icons/movie.svg" alt="" aria-hidden="true" className="size-6" />
          </span>
          <span className="text-xl leading-6 font-black tracking-[-0.7px] text-ink">
            UMCine
          </span>
        </Link>

        <nav className="flex items-center gap-[30px]">
          {MENUS.map(({ label, to }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/" }}>
              {({ isActive }) => (
                <span
                  className={cn(
                    "text-sm leading-[17px] font-bold",
                    isActive ? "text-ink underline" : "text-sub",
                  )}
                >
                  {label}
                </span>
              )}
            </Link>
          ))}
          <button type="button" className="text-sm leading-[17px] font-bold text-sub">
            내 정보
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          to="/search"
          aria-label="영화 검색"
          className="flex size-[42px] items-center justify-center rounded-lg border border-line bg-white"
        >
          <img src="/icons/movie-icons/search.svg" alt="" aria-hidden="true" className="size-6" />
        </Link>
        <button
          type="button"
          className="flex h-[42px] items-center justify-center rounded-lg bg-primary px-4 text-sm leading-[17px] font-extrabold text-white"
        >
          로그인
        </button>
      </div>
    </header>
  );
}