import { movies as initialMovies } from "../../data/movies";
import MovieGrid from "../../components/movies/movie-grid";

export function MovieListPage() {
  return (
    <main>
      <MovieGrid movies={initialMovies} />
    </main>
  );
}
