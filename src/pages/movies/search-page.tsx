import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  const handleClear = () => {
    setSearchText("");
    navigate({ search: {} });
  };

  return (
    <main className="min-h-screen bg-[#F6F7F9] px-6 text-gray-900">
      {/* 1. 검색 전: 중앙 화면 레이아웃 */}
      {!normalizedQuery ? (
        <div className="flex min-h-[calc(100vh-24rem)] flex-col items-center justify-center">
          <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
            어떤 영화를 찾고 있나요?
          </h1>

          <form
            onSubmit={handleSubmit}
            className="relative flex w-full max-w-xl items-center rounded-2xl border border-gray-900 bg-white p-2 shadow-sm focus-within:shadow-md"
          >
            <div className="pointer-events-none pl-3 text-gray-400">
              <img src="/icons/search.svg" alt="검색" className="h-6 w-6" />
            </div>

            <input
              aria-label="검색어"
              placeholder="예: 스파이더맨"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="w-full bg-transparent px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />

            <button
              type="submit"
              className="ml-2 shrink-0 rounded-xl bg-[#18181B] px-5 py-2.5 text-xs font-semibold text-white hover:bg-black"
            >
              검색
            </button>
          </form>
        </div>
      ) : (
        /* 2. 검색 후: 결과 화면 레이아웃 */
        <div className="mx-auto max-w-6xl py-10">
          {/* 페이지 타이틀 */}
          <h1 className="mb-6 text-2xl font-extrabold text-gray-900 md:text-3xl">
            영화 검색
          </h1>

          {/* 검색바 */}
          <form
            onSubmit={handleSubmit}
            className="relative mb-4 flex w-full items-center rounded-lg border border-gray-200 bg-white p-2 shadow-sm focus-within:border-gray-400"
          >
            <div className="pointer-events-none pl-3 text-gray-400">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              aria-label="검색어"
              placeholder="예: 스파이더맨"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="w-full bg-transparent px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />

            {searchText && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            <button
              type="submit"
              className="ml-2 shrink-0 rounded-md bg-[#18181B] px-5 py-2.5 text-xs font-semibold text-white hover:bg-black"
            >
              다시 검색
            </button>
          </form>

          {/* 검색 결과 */}
          <div className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-3">
              <h2 className="text-base font-bold text-gray-900">
                ‘{query}’ 검색 결과
              </h2>
              <span className="text-xs text-gray-400">
                영화 {searchResults.length}편
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="py-20 text-center text-sm text-gray-500">
                검색 결과가 없어요.
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
                {searchResults.map((movie) => (
                  <li key={movie.id} className="flex gap-4">
                    <img
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                      className="h-[190px] w-[126px] shrink-0 rounded-lg object-cover shadow-sm"
                    />

                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <h3 className="text-lg font-bold leading-snug text-gray-900">
                          {movie.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {movie.originalTitle} · {movie.releaseDate}
                        </p>
                        <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-gray-500">
                          {movie.overview}
                        </p>
                      </div>

                      <div className="mt-2">
                        <Link
                          to="/movies/$movieId"
                          params={{ movieId: String(movie.id) }}
                          className="inline-flex items-center text-xs font-semibold text-[#2563EB] hover:underline mb-10"
                        >
                          상세 보기 &rarr;
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
