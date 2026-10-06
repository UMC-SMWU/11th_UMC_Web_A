import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const detailParams = { movieId: String(movie.id) };

  return (
    <article className="flex w-full flex-col gap-1">
      <div className="relative h-[274px] w-full overflow-hidden rounded-[10px] bg-surface">
        <Link to="/movies/$movieId" params={detailParams} className="block size-full">
          <img
            className="block size-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            loading="lazy"
          />
        </Link>
        <BookmarkButton movieId={movie.id} className="absolute top-2.5 right-2.5" />
      </div>

      <Link
        to="/movies/$movieId"
        params={detailParams}
        className="truncate pt-[5px] text-sm leading-none font-extrabold text-ink"
      >
        {movie.title}
      </Link>
      <div className="text-xs leading-none text-muted">{movie.releaseDate}</div>
    </article>
  );
}
