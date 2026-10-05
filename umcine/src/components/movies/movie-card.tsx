import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
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

        <button
          type="button"
          aria-pressed={movie.isBookmarked}
          aria-label={
            movie.isBookmarked
              ? `${movie.title} 북마크 해제`
              : `${movie.title} 북마크 추가`
          }
          onClick={() => onToggleBookmark(movie.id)}
          className={cn(
            "absolute top-2 right-2 flex size-9 items-center justify-center rounded-lg",
            movie.isBookmarked
              ? "bg-primary"
              : "border border-line bg-white",
          )}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/movie-icons/bookmark.svg"
                : "/icons/movie-icons/bookmark-outline.svg"
            }
            alt=""
            aria-hidden="true"
            className="size-5"
          />
        </button>
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