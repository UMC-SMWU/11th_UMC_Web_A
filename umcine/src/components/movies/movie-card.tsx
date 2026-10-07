import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex flex-col gap-1">
      <div className="relative h-[274px] overflow-hidden rounded-[10px] bg-canvas">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="size-full object-cover"
          />
        </Link>

        <BookmarkButton
          movieId={movie.id}
          movieTitle={movie.title}
          className="absolute top-2 right-2"
        />
      </div>

      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="pt-[5px]"
      >
        <h3 className="text-sm leading-[17px] font-extrabold text-ink">
          {movie.title}
        </h3>
      </Link>

      <p className="text-xs leading-[14px] text-muted">{movie.releaseDate}</p>
    </article>
  );
}