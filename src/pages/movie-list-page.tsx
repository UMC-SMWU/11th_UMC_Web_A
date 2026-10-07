import { useState } from "react";
import { movies as initialMovies } from "../data/movies";
import type { Movie } from "../types/movie";
import Header from "../components/header";
import MovieGrid from "../components/movie-grid";
import Pagination from "../components/pagination";
import "./movie-list-page.css";

export default function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);

  const handleToggleBookmark = (id: number) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie
      )
    );
  };

  return (
    <>
      <Header />
      <main className="movie-list-page">
        <h1 className="movie-list-page__title">영화 목록</h1>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        <Pagination />
      </main>
    </>
  );
}