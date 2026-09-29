import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  // 뒤로 가기·앞으로 가기로 URL의 query가 바뀌면 입력창도 함께 맞춰요.
  // Effect 대신 렌더링 중에 이전 값과 비교해 state를 맞추면 추가 렌더링 없이 동기화할 수 있어요.
  const [syncedQuery, setSyncedQuery] = useState(query);
  if (query !== syncedQuery) {
    setSyncedQuery(query);
    setSearchText(query ?? "");
  }

  const trimmedQuery = query?.trim() ?? "";
  const normalizedQuery = trimmedQuery.toLowerCase();
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-5 md:px-20 md:py-6">
      <h1 className="mb-5 text-[28px] leading-[34px] font-bold tracking-[-1.71px] text-ink md:text-[38px] md:leading-[44px]">
        영화 검색
      </h1>

      <form className="mb-8 flex gap-2" onSubmit={handleSubmit}>
        <input
          className="h-11 min-w-0 flex-1 rounded-lg border border-line bg-white px-4 text-[15px] outline-none focus:border-brand"
          aria-label="검색어"
          placeholder="영화 제목을 입력해 주세요"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button
          type="submit"
          className="h-11 cursor-pointer rounded-lg bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="py-10 text-center text-[15px] text-muted">검색어를 입력해 주세요.</p>
      ) : (
        <section>
          <h2 className="text-xl font-bold text-ink">‘{trimmedQuery}’ 검색 결과</h2>
          <p className="mt-1 mb-5 text-sm text-muted">영화 {searchResults.length}편</p>

          {searchResults.length === 0 ? (
            <p className="py-10 text-center text-[15px] text-muted">검색 결과가 없어요.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-4 rounded-[10px] border border-line bg-white p-4 md:gap-6 md:p-5"
                >
                  <img
                    className="aspect-[2/3] w-24 shrink-0 rounded-lg object-cover md:w-[120px]"
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <h3 className="text-lg font-extrabold text-ink">{movie.title}</h3>
                    <p className="text-[13px] text-muted">{movie.originalTitle}</p>
                    <p className="text-[13px] text-muted">{movie.releaseDate}</p>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-subtle">
                      {movie.overview}
                    </p>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-auto pt-3 text-sm font-bold text-brand hover:text-brand-hover"
                    >
                      상세 보기
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
