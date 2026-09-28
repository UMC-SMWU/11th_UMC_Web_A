import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
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

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto flex max-w-[1280px] flex-col gap-8 px-20 py-10">
      <h1 className="text-2xl font-black text-ink">영화 검색</h1>

      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <input
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="영화 제목을 입력해 주세요"
          className="h-[42px] flex-1 rounded-lg border border-line bg-white px-4 text-sm text-ink outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="h-[42px] rounded-lg bg-primary px-5 text-sm font-extrabold text-white"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="text-sm text-sub">검색어를 입력해 주세요.</p>
      ) : (
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg font-extrabold text-ink">‘{query}’ 검색 결과</h2>
            <p className="text-sm text-sub">영화 {searchResults.length}편</p>
          </div>

          {searchResults.length === 0 ? (
            <p className="text-sm text-sub">검색 결과가 없어요.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-5 rounded-[10px] bg-white p-4"
                >
                  <img
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    className="h-[150px] w-[100px] shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-extrabold text-ink">{movie.title}</h3>
                    <p className="text-sm text-sub">{movie.originalTitle}</p>
                    <p className="text-xs text-muted">{movie.releaseDate}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-sub">{movie.overview}</p>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-auto w-fit text-sm font-bold text-primary"
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