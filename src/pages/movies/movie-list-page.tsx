import MovieGrid from "../../components/movies/movie-grid";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, 500);

  // 한 번에 표시할 페이지 개수
  const pageGroupSize = 5;

  // 현재 페이지 그룹의 첫 번째 번호
  const startPage = Math.floor((page - 1) / pageGroupSize) * pageGroupSize + 1;

  // 현재 페이지 그룹의 마지막 번호
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  // 페이지 번호 배열
  const pageNumbers = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, index) => startPage + index,
  );

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  return (
    <main>
      <div className="page-title">
        <h1>영화 목록</h1>

        {moviesQuery.isPending ? (
          <p>영화 목록을 불러오는 중이에요.</p>
        ) : moviesQuery.isError ? (
          <p>영화 목록을 불러오지 못했어요.</p>
        ) : movies.length === 0 ? (
          <p>조건에 맞는 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid movies={movies} />

            {/* 페이지네이션 */}
            <div className="my-8 flex items-center justify-center gap-2">
              {/* 이전 페이지 */}
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-md disabled:cursor-not-allowed disabled:opacity-30"
              >
                <img
                  src="/icons/chevron-left.svg"
                  alt="이전 페이지"
                  className="h-4 w-4"
                />
              </button>

              {/* 페이지 번호 */}
              {pageNumbers.map((pageNumber) => (
                <button
                  type="button"
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                    page === pageNumber
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              {/* 다음 페이지 */}
              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-md disabled:cursor-not-allowed disabled:opacity-30"
              >
                <img
                  src="/icons/chevron-right.svg"
                  alt="다음 페이지"
                  className="h-4 w-4"
                />
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
