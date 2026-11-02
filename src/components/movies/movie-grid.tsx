import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
}

function MovieGrid({ movies }: MovieGridProps) {
  return (
    <section className="mx-auto mt-8 mb-8 grid w-full justify-items-center max-w-[1200px] grid-cols-1 gap-x-[25px] gap-y-8 px-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}

export default MovieGrid;
