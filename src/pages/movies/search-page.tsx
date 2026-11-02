import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { searchMovies } from "../../api/movies/serach-movie";
import type { TmdbMovieListItem } from "../../api/movies/models";

export function SearchPage() {
  const { query = "" } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const [searchText, setSearchText] = useState(query);

  const [searchResult, setSearchResult] = useState<{
    query: string;
    movies: TmdbMovieListItem[];
    errorMessage: string | null;
  } | null>(null);

  const normalizedQuery = query.trim();

  const isLoading =
    normalizedQuery !== "" && searchResult?.query !== normalizedQuery;

  const movies =
    searchResult?.query === normalizedQuery ? searchResult.movies : [];

  const errorMessage =
    searchResult?.query === normalizedQuery ? searchResult.errorMessage : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  function handleClear() {
    setSearchText("");
    navigate({ search: {} });
  }

  useEffect(() => {
    if (!normalizedQuery) return;

    let ignore = false;

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) {
          setSearchResult({
            query: normalizedQuery,
            movies: response.results,
            errorMessage: null,
          });
        }
      })
      .catch(() => {
        if (!ignore) {
          setSearchResult({
            query: normalizedQuery,
            movies: [],
            errorMessage: "검색 결과를 불러오지 못했어요.",
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [normalizedQuery]);

  return (
    <main className="min-h-screen bg-[#F6F7F9] px-6 text-gray-900">
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
        <div className="mx-auto max-w-6xl py-10">
          <h1 className="mb-6 text-2xl font-extrabold text-gray-900 md:text-3xl">
            영화 검색
          </h1>

          <form
            onSubmit={handleSubmit}
            className="relative mb-4 flex w-full items-center rounded-lg border border-gray-200 bg-white p-2 shadow-sm focus-within:border-gray-400"
          >
            <div className="pointer-events-none pl-3 text-gray-400">
              <img src="/icons/search.svg" alt="검색" className="h-8 w-8" />
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
                <img
                  src="/icons/close.svg"
                  alt="검색어 지우기"
                  className="h-6 w-6"
                />
              </button>
            )}

            <button
              type="submit"
              className="ml-2 shrink-0 rounded-md bg-[#18181B] px-5 py-2.5 text-xs font-semibold text-white hover:bg-black"
            >
              다시 검색
            </button>
          </form>

          <div className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-3">
              <h2 className="text-base font-bold text-gray-900">
                ‘{query}’ 검색 결과
              </h2>

              <span className="text-xs text-gray-400">
                영화 {movies.length}편
              </span>
            </div>

            {isLoading ? (
              <div className="py-20 text-center text-sm text-gray-500">
                검색 결과를 불러오는 중...
              </div>
            ) : errorMessage ? (
              <div className="py-20 text-center text-sm text-red-500">
                {errorMessage}
              </div>
            ) : movies.length === 0 ? (
              <div className="py-20 text-center text-sm text-gray-500">
                검색 결과가 없어요.
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
                {movies.map((movie) => (
                  <li key={movie.id} className="flex gap-4">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : undefined
                      }
                      alt={`${movie.title} 포스터`}
                      className="h-[190px] w-[126px] shrink-0 rounded-lg object-cover shadow-sm"
                    />

                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <h3 className="text-lg font-bold leading-snug text-gray-900">
                          {movie.title}
                        </h3>

                        <p className="mt-0.5 text-xs text-gray-400">
                          {movie.original_title} · {movie.release_date}
                        </p>

                        <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-gray-500">
                          {movie.overview}
                        </p>
                      </div>

                      <div className="mt-2">
                        <Link
                          to="/movies/$movieId"
                          params={{ movieId: String(movie.id) }}
                          className="mb-10 inline-flex items-center text-xs font-semibold text-[#2563EB] hover:underline"
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
