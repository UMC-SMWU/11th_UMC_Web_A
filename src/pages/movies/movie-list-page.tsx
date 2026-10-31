import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

// TMDB는 total_pages가 커도 500페이지까지만 조회 가능
const MAX_PAGE = 500;

export default function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, MAX_PAGE);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <main className="bg-[#f7f7f8] px-10 pb-[60px] pt-8">
      <h1 className="mb-6 text-2xl font-bold text-[#111111]">영화 목록</h1>

      {moviesQuery.isPending ? (
        <p className="text-[#999999]">영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p className="text-[#999999]">영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p className="text-[#999999]">조건에 맞는 영화가 없어요.</p>
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