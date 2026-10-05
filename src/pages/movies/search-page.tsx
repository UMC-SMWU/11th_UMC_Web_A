import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="min-h-[calc(100vh-88px)] bg-[#F6F7F9]">
      {!normalizedQuery ? (
        <section className="mx-auto flex w-[790px] flex-col items-center gap-9 pt-[163px]">
          <h1 className="whitespace-nowrap text-center text-[46px] font-bold leading-[52.44px] tracking-[-2.3px] text-[#17191E]">
            어떤 영화를 찾고 있나요?
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex h-[59px] w-full items-center rounded-[10px] border border-[#17191E] bg-white px-3 shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
          >
            <div className="flex flex-1 items-center gap-3 px-3">
              <img
                src="/icons/search.svg"
                alt=""
                aria-hidden="true"
                className="h-5 w-5"
              />

              <input
                aria-label="검색어"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="예: 스파이더맨"
                className="w-full bg-transparent text-[14px] text-[#17191E] outline-none placeholder:text-[#A4A8B0]"
              />
            </div>
            <button
              type="submit"
              className="h-[42px] w-[90px] rounded-[7px] bg-[#19191D] text-[13px] font-bold text-white"
            >
              검색
            </button>
          </form>
        </section>
      ) : (
        /* 검색 결과 화면 */
        <section className="mx-auto w-full max-w-[1280px] py-8">
          <h1 className="mb-6 text-[32px] font-bold text-[#17191E]">
            영화 검색
          </h1>

          {/* 검색창 */}
          <form
            onSubmit={handleSubmit}
            className="flex h-[52px] w-full items-center rounded-[8px] border border-[#D9DCE2] bg-white px-4"
          >
            <img
              src="/icons/search.svg"
              alt=""
              aria-hidden="true"
              className="mr-3 h-5 w-5"
            />

            <input
              aria-label="검색어"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-[14px] text-[#17191E] outline-none"
            />

            <button
              type="button"
              onClick={() => setSearchText("")}
              className="mr-4 text-[24px] leading-none text-[#6D727C]"
              aria-label="검색어 지우기"
            >
              ×
            </button>

            <button
              type="submit"
              className="h-[36px] rounded-[7px] bg-[#19191D] px-5 text-[13px] font-bold text-white"
            >
              다시 검색
            </button>
          </form>

          {/* 검색 결과 정보 */}
          <div className="flex items-center justify-between border-b border-[#E1E3E8] py-4">
            <h2 className="text-[16px] font-bold text-[#17191E]">
              ‘{query}’ 검색 결과
            </h2>

            <p className="text-[12px] text-[#9A9EA7]">
              영화 {searchResults.length}편 · 1페이지
            </p>
          </div>

          {searchResults.length === 0 ? (
            <div className="py-20 text-center text-[16px] text-[#6D727C]">
              검색 결과가 없어요.
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-x-10">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-5 border-b border-[#E1E3E8] py-6"
                >
                  <img
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    className="h-[150px] w-[100px] shrink-0 rounded-[6px] object-cover"
                  />

                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="text-[17px] font-bold text-[#17191E]">
                      {movie.title}
                    </h3>

                    <p className="mt-1 text-[12px] text-[#9A9EA7]">
                      {movie.originalTitle} · {movie.releaseDate}
                    </p>

                    <p className="mt-3 line-clamp-2 text-[13px] leading-5 text-[#6D727C]">
                      {movie.overview}
                    </p>

                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-4 w-fit text-[13px] font-bold text-[#4F64E8]"
                    >
                      상세 보기 →
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
