import type { TmdbMovieListItem } from "../../api/movies/models";
import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="w-full">
      <div className="relative aspect-[11/16] w-full overflow-hidden rounded-lg">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            className="block h-full w-full object-cover"
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : undefined
            }
            alt={movie.title}
          />
        </Link>

        <div className="absolute top-3 right-3">
          <BookmarkButton movieId={movie.id} />
        </div>
      </div>

      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h3 className="mt-3 mb-1 text-base font-semibold text-[#222222]">
          {movie.title}
        </h3>
      </Link>

      <p className="m-0 text-sm text-[#888888]">{movie.release_date}</p>
    </article>
  );
}

export default MovieCard;
