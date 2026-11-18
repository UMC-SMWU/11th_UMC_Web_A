import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

const MENUS = [
  { label: "영화", to: "/" },
  { label: "검색", to: "/search" },
  { label: "내 정보", to: "/me" },
] as const;

const authButtonClass =
  "flex h-[42px] items-center justify-center rounded-lg bg-primary px-4 text-sm leading-[17px] font-extrabold text-white";

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

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

        {!accessToken ? (
          <Link to="/login" className={authButtonClass}>
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span className="h-[42px] w-24 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <Link to="/me" className={authButtonClass}>
            마이페이지
          </Link>
        )}
      </div>
    </header>
  );
}