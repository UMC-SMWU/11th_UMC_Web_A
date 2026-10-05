import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

const PAGE_SIZE = 10;

export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(movies.length / PAGE_SIZE));
  const pagedMovies = movies.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function handleToggleBookmark(movieId: number) {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <main className="mx-auto flex max-w-[1280px] flex-col gap-10 px-20 py-10">
      <MovieGrid movies={pagedMovies} onToggleBookmark={handleToggleBookmark} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChangePage={setCurrentPage}
      />
    </main>
  );
}