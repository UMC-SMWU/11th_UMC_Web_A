import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [prevQuery, setPrevQuery] = useState(query);

  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ?? "");
  }

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

  // 검색 전 (빈 상태)
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
      <p className="mb-6 text-sm text-[#999999]">
        영화 {searchResults.length}편
      </p>

      {searchResults.length === 0 ? (
        <p className="text-[#999999]">검색 결과가 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-6">
          {searchResults.map((movie) => (
            <li
              key={movie.id}
              className="flex gap-5 border-b border-[#eeeeee] pb-6"
            >
              <img
                src={movie.posterPath}
                alt={`${movie.title} 포스터`}
                className="h-36 w-24 shrink-0 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[#111111]">
                  {movie.title}
                </h3>
                <p className="mt-1 text-sm text-[#999999]">
                  {movie.originalTitle}
                </p>
                <p className="mt-1 text-sm text-[#999999]">
                  {movie.releaseDate}
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
          ))}
        </ul>
      )}
    </main>
  );
}