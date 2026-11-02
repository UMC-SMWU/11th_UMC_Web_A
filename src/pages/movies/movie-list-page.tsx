import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const handlePageChange = (nextPage: number) => {
    if (nextPage >= 1 && nextPage <= totalPages) {
      setPage(nextPage);
    }
  };

  return (
    <main>
      {moviesQuery.isPending ? (
        <p>영화를 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p>영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p>표시할 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movies} />

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
