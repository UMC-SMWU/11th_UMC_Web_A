import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

export default function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="flex items-center justify-between border-b border-[#eeeeee] bg-white px-10 py-4">
      <div className="flex items-center gap-10">
        <div className="text-lg font-bold text-[#111111]">🎬 UMCine</div>
        <nav className="flex gap-6">
          <Link
            to="/"
            className="text-[15px] font-medium text-[#666666] hover:text-[#111111]"
          >
            영화
          </Link>
          <Link
            to="/search"
            className="text-[15px] font-medium text-[#666666] hover:text-[#111111]"
          >
            검색
          </Link>
          <Link
            to="/profile"
            className="text-[15px] font-medium text-[#666666] hover:text-[#111111]"
          >
            내 정보
          </Link>
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

        {!accessToken ? (
          <Link
            to="/login"
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white"
          >
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span className="h-9 w-24 animate-pulse rounded-md bg-gray-200" />
        ) : (
          <Link
            to="/profile"
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white"
          >
            마이페이지
          </Link>
        )}
      </div>
    </header>
  );
}