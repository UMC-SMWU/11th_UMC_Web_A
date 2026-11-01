import type { TmdbMovieListItem } from "../../api/movies/models";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  if (movies.length === 0) {
    return <p className="text-sm text-sub">표시할 영화가 없어요.</p>;
  }

  return (
    <div className="grid grid-cols-5 gap-x-[18px] gap-y-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}