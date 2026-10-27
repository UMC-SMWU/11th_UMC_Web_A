import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";

// 한 페이지에 보여 줄 영화 수예요. (한 줄에 5개)
const PAGE_SIZE = 5;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // 현재 페이지에 해당하는 영화만 잘라서 보여 줘요. 5주차에 API를 연결하면 서버가 페이지를 나눠 줘요.
  const totalPages = Math.max(1, Math.ceil(movies.length / PAGE_SIZE));
  const pageMovies = movies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-5 md:px-20 md:py-6">
      <h1 className="mb-5 text-[28px] leading-[34px] font-bold tracking-[-1.71px] text-ink md:text-[38px] md:leading-[44px]">
        영화 목록
      </h1>
      <MovieGrid movies={pageMovies} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
