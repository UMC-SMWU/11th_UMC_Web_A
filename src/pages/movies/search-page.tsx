import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { StatusMessage } from "../../components/common/status-message";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { MoviePoster } from "../../components/movies/movie-poster";
import { formatReleaseDate } from "../../utils/movies/format-movie";

interface SearchResultsProps {
  query: string;
}

function SearchResults({ query }: SearchResultsProps) {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // "다시 시도"를 누르면 값이 바뀌어서 같은 검색어로 다시 요청해요.
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // 검색어가 바뀌면 이 컴포넌트가 정리되면서 이전 응답은 무시돼요.
    // 이전 응답이 늦게 도착해도 현재 검색 결과를 덮어쓰지 않아요.
    let ignore = false;

    searchMovies({ query })
      .then((response) => {
        if (ignore) return;
        setMovies(response.results);
        setTotalResults(response.total_results);
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
  }, [query, retryCount]);

  function handleRetry() {
    setIsLoading(true);
    setErrorMessage(null);
    setRetryCount((count) => count + 1);
  }

  // 로딩 -> 오류 -> 빈 결과 -> 성공 순서로 화면을 구분해요.
  if (isLoading) {
    return <StatusMessage>검색 결과를 불러오는 중이에요.</StatusMessage>;
  }

  if (errorMessage) {
    return (
      <StatusMessage tone="error" onRetry={handleRetry}>
        {errorMessage}
      </StatusMessage>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-bold text-ink">‘{query}’ 검색 결과</h2>
      <p className="mt-1 mb-5 text-sm text-muted">
        영화 {totalResults}편{movies.length < totalResults ? ` 중 ${movies.length}편 표시` : ""}
      </p>

      {movies.length === 0 ? (
        <StatusMessage>검색 결과가 없어요.</StatusMessage>
      ) : (
        <ul className="flex flex-col gap-4">
          {movies.map((movie) => (
            <li
              key={movie.id}
              className="flex gap-4 rounded-[10px] border border-line bg-white p-4 md:gap-6 md:p-5"
            >
              <MoviePoster
                posterPath={movie.poster_path}
                title={movie.title}
                className="aspect-[2/3] w-24 shrink-0 rounded-lg md:w-[120px]"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="text-lg font-extrabold text-ink">{movie.title}</h3>
                <p className="text-[13px] text-muted">{movie.original_title}</p>
                <p className="text-[13px] text-muted">{formatReleaseDate(movie.release_date)}</p>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-subtle">
                  {movie.overview || "줄거리 정보가 없어요."}
                </p>
                <div className="mt-auto flex items-center gap-4 pt-3">
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="text-sm font-bold text-brand hover:text-brand-hover"
                  >
                    상세 보기
                  </Link>
                  <BookmarkButton movieId={movie.id} variant="text" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

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

      {/* 빈 검색어는 요청하지 않고 안내만 보여 줘요. 검색어가 바뀌면 key가 달라져 상태가 새로 시작돼요. */}
      {trimmedQuery ? (
        <SearchResults key={trimmedQuery} query={trimmedQuery} />
      ) : (
        <StatusMessage>검색어를 입력해 주세요.</StatusMessage>
      )}
    </main>
  );
}
