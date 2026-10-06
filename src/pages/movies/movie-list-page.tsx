import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";

const TOTAL_PAGES = 5;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-5 md:px-20 md:py-6">
      <h1 className="mb-5 text-[28px] leading-[34px] font-bold tracking-[-1.71px] text-ink md:text-[38px] md:leading-[44px]">
        영화 목록
      </h1>
      <MovieGrid movies={movies} />
      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
