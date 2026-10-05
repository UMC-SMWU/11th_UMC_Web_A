import { useEffect, useState } from "react";
import { movies as initialMovies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import {
  readBookmarkIds,
  saveBookmarkIds,
} from "../../utils/bookmark-storage";

export default function MovieListPage() {
  // 1. 초기값 함수에서 readBookmarkIds() 호출
  const [movies, setMovies] = useState<Movie[]>(() => {
    const bookmarkIds = readBookmarkIds();
    return initialMovies.map((movie) => ({
      ...movie,
      isBookmarked: bookmarkIds.includes(movie.id),
    }));
  });

  // 2. 북마크 ID 배열이 바뀔 때 saveBookmarkIds() 호출
  useEffect(() => {
    const bookmarkIds = movies
      .filter((movie) => movie.isBookmarked)
      .map((movie) => movie.id);
    saveBookmarkIds(bookmarkIds);
  }, [movies]);

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