import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

// TMDB는 500페이지까지만 요청할 수 있어요.
const MAX_PAGE = 500;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page: currentPage }],
    queryFn: () => getMovies({ page: currentPage }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, MAX_PAGE);

  const handlePageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  return (
    <main className="mx-auto flex max-w-[1280px] flex-col gap-10 px-20 py-10">
      {moviesQuery.isPending ? (
        <p>영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p>영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p>조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChangePage={handlePageChange}
          />
        </>
      )}
    </main>
  );
}