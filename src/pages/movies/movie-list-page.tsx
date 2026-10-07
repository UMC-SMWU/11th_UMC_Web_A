import { useState } from "react";
import { movies as initialMovies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export default function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);

  const handleToggleBookmark = (id: number) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  };

  return (
    <main className="bg-[#f7f7f8] px-10 pb-[60px] pt-8">
      <h1 className="mb-6 text-2xl font-bold text-[#111111]">영화 목록</h1>
      <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      <Pagination />
    </main>
  );
}