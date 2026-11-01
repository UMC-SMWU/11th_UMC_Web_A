import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../../components/bookmark-button";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [prevQuery, setPrevQuery] = useState(query);

  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ?? "");
  }

  const normalizedQuery = query?.trim() ?? "";

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  // 처음 들어왔을 때 검색어가 있으면 바로 로딩 상태로 시작
  const [isLoading, setIsLoading] = useState(normalizedQuery !== "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 검색어가 바뀐 순간 바로 초기화
  const [prevNormalizedQuery, setPrevNormalizedQuery] = useState(normalizedQuery);
  if (normalizedQuery !== prevNormalizedQuery) {
    setPrevNormalizedQuery(normalizedQuery);
    setMovies([]);
    setErrorMessage(null);
    setIsLoading(normalizedQuery !== "");
  }

  // Effect는 이제 요청 보내고, 응답 오면 저장만 함
  useEffect(() => {
    if (!normalizedQuery) return;

    let ignore = false;

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) setMovies(response.results);
      })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [normalizedQuery]);

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
            {!isLoading && !errorMessage && (
              <p className="text-sm text-sub">영화 {movies.length}편</p>
            )}
          </div>
          
          {isLoading ? (
            <p className="text-sm text-sub">검색 결과를 불러오는 중이에요.</p>
          ) : errorMessage ? (
            <p className="text-sm text-sub">{errorMessage}</p>
          ) : movies.length === 0 ? (
            <p className="text-sm text-sub">검색 결과가 없어요.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {movies.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-5 rounded-[10px] bg-white p-4"
                >
                  {movie.poster_path ? (
                    <img
                      src={getTmdbPosterUrl(movie.poster_path) ?? ""}
                      alt={`${movie.title} 포스터`}
                      className="h-[150px] w-[100px] shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-[150px] w-[100px] shrink-0 items-center justify-center rounded-lg bg-canvas text-xs text-sub">
                      이미지 없음
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-extrabold text-ink">{movie.title}</h3>
                    <p className="text-sm text-sub">{movie.original_title}</p>
                    <p className="text-xs text-muted">{movie.release_date}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-sub">{movie.overview}</p>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-auto w-fit text-sm font-bold text-primary"
                    >
                      상세 보기 →
                    </Link>
                  </div>

                  <BookmarkButton
                    movieId={movie.id}
                    movieTitle={movie.title}
                    className="ml-auto shrink-0 self-start"
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}