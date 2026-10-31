import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { FormEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/bookmark-button";
import Pagination from "../../components/movies/pagination";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

// TMDB는 total_pages가 커도 500페이지까지만 조회할 수 있어요
const MAX_PAGE = 500;

export function SearchPage() {
  const { query: rawQuery, page = 1 } = useSearch({ from: "/search" });
  const query = rawQuery ?? "";
  const normalizedQuery = query.trim();
  const navigate = useNavigate({ from: "/search" });

  const [searchText, setSearchText] = useState(query);
  const [prevQuery, setPrevQuery] = useState(query);

  // URL의 검색어가 바뀌면 입력창도 맞춤 (렌더링 중 동기화)
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query);
  }

  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery, page }],
    queryFn: () => searchMovies({ query: normalizedQuery, page }),
    enabled: normalizedQuery.length > 0, // 빈 검색어는 요청하지 않음
  });

  const movies = searchQuery.data?.results ?? [];
  const totalResults = searchQuery.data?.total_results ?? 0;
  const totalPages = Math.min(searchQuery.data?.total_pages ?? 0, MAX_PAGE);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery, page: 1 } : {},
    });
  }

  function handlePageChange(nextPage: number) {
    navigate({ search: (prev) => ({ ...prev, page: nextPage }) });
  }

  const searchBar = (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl items-center gap-2 rounded-xl border-2 border-[#111111] bg-white px-5 py-3"
    >
      <span aria-hidden="true" className="text-[#999999]">
        🔍
      </span>
      <input
        aria-label="검색어"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="예: 스파이더맨"
        className="flex-1 text-sm outline-none placeholder:text-[#bbbbbb]"
      />
      <button
        type="submit"
        className="rounded-lg bg-[#111111] px-3 py-2 text-xs font-semibold text-white"
      >
        검색
      </button>
    </form>
  );

  // 1. 빈 검색어: 요청하지 않고 안내만 표시
  if (!normalizedQuery) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center bg-[#f7f7f8] px-10 pt-24">
        <h1 className="mb-6 text-2xl font-bold text-[#111111]">
          어떤 영화를 찾고 있나요?
        </h1>
        {searchBar}
      </main>
    );
  }

  return (
    <main className="bg-[#f7f7f8] px-10 pb-[60px] pt-8">
      <div className="mb-8 flex justify-center">{searchBar}</div>

      <h2 className="mb-1 text-lg font-bold text-[#111111]">
        '{query}' 검색 결과
      </h2>

      {/* 2. 로딩 → 3. 오류 → 4. 빈 결과 → 5. 성공 */}
      {searchQuery.isLoading ? (
        <p className="text-[#999999]">검색 결과를 불러오는 중이에요.</p>
      ) : searchQuery.isError ? (
        <p className="text-[#999999]">검색 결과를 불러오지 못했어요.</p>
      ) : searchQuery.isSuccess && movies.length === 0 ? (
        <p className="text-[#999999]">영화를 찾을 수 없어요.</p>
      ) : (
        <>
          <p className="mb-6 text-sm text-[#999999]">
            영화 {totalResults}편 · {page}페이지
          </p>
          <ul className="flex flex-col gap-6">
            {movies.map((movie) => {
              const posterUrl = getTmdbPosterUrl(movie.poster_path);

              return (
                <li
                  key={movie.id}
                  className="flex gap-5 border-b border-[#eeeeee] pb-6"
                >
                  <div className="relative shrink-0">
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={`${movie.title} 포스터`}
                        className="h-36 w-24 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-36 w-24 items-center justify-center rounded-lg bg-[#e5e5e5] text-xs text-[#999999]">
                        이미지 없음
                      </div>
                    )}
                    <BookmarkButton
                      movieId={movie.id}
                      className="absolute right-1.5 top-1.5 h-7 w-7 bg-black/55 text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-[#111111]">
                      {movie.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#999999]">
                      {movie.original_title}
                    </p>
                    <p className="mt-1 text-sm text-[#999999]">
                      {movie.release_date.replaceAll("-", ".")}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-[#333333]">
                      {movie.overview}
                    </p>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                      상세 보기
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}