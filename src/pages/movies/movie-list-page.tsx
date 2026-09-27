import { movies } from "../../data/movies";
import MovieGrid from "../../components/movies/movie-grid";

function MovieListPage() {
  return <MovieGrid movies={movies} onToggleBookmark={() => {}} />;
}

export default MovieListPage;
