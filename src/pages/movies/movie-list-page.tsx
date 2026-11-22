import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { StatusMessage } from "../../components/common/status-message";
import { MovieGrid, MovieGridSkeleton } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

// 디자인의 페이지 버튼 개수에 맞춰요. TMDB는 인기 영화를 최대 500페이지까지만 제공해요.
const MAX_VISIBLE_PAGES = 5;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // "다시 시도"를 누르면 값이 바뀌어서 같은 페이지를 다시 요청해요.
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // 화면을 떠나거나 페이지가 바뀌면 이전 요청의 결과는 무시해요. (요청 자체를 취소하지는 않아요.)
    let ignore = false;

    async function loadMovies() {
      try {
        const response = await getMovies({ page: currentPage });
        if (!ignore) {
          setMovies(response.results);
          setTotalPages(Math.min(response.total_pages, MAX_VISIBLE_PAGES));
        }
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, [currentPage, retryCount]);

  // 요청을 시작하는 사용자 동작(페이지 이동, 다시 시도)에서 로딩 상태로 바꿔요.
  function handlePageChange(page: number) {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentPage(page);
  }

  function handleRetry() {
    setIsLoading(true);
    setErrorMessage(null);
    setRetryCount((count) => count + 1);
  }

  // 로딩 -> 오류 -> 빈 결과 -> 성공 순서로 화면을 구분해요.
  function renderContent() {
    if (isLoading) return <MovieGridSkeleton />;
    if (errorMessage) {
      return (
        <StatusMessage tone="error" onRetry={handleRetry}>
          {errorMessage}
        </StatusMessage>
      );
    }
    return <MovieGrid movies={movies} />;
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-5 md:px-20 md:py-6">
      <h1 className="mb-5 text-[28px] leading-[34px] font-bold tracking-[-1.71px] text-ink md:text-[38px] md:leading-[44px]">
        영화 목록
      </h1>
      {renderContent()}
      {!errorMessage && totalPages > 0 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : null}
    </main>
  );
}
