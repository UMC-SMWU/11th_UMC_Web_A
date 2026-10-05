import { useState, useEffect } from "react";
import { movies as initialMovies } from "../../data/movies";
import MovieGrid from "../../components/movies/movie-grid";
import { readBookmarkIds, saveBookmarkIds } from "../../utils/bookmark-storage";
export function MovieListPage() {
  const [movies, setMovies] = useState(() => {
    const bookmarkIds = readBookmarkIds();
    return initialMovies.map((movie) => ({
      ...movie,
      isBookmarked: bookmarkIds.includes(movie.id),
    }));
  });

  const handleToggleBookmark = (movieId: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  };

  useEffect(() => {
    const bookmarkIds = movies
      .filter((movie) => movie.isBookmarked)
      .map((movie) => movie.id);
    saveBookmarkIds(bookmarkIds);
  }, [movies]);

  return (
    <main>
      <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
    </main>
  );
}
