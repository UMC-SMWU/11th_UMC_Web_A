import type { Movie } from "../types/movie";
import { BookmarkIcon, BookmarkOutlineIcon } from "./icons";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="flex flex-col gap-1">
      <div className="relative h-[274px] overflow-hidden rounded-[10px] bg-canvas">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="h-full w-full object-cover"
        />

        <button
          type="button"
          aria-pressed={movie.isBookmarked}
          aria-label={
            movie.isBookmarked
              ? `${movie.title} 북마크 해제`
              : `${movie.title} 북마크 추가`
          }
          onClick={() => onToggleBookmark(movie.id)}
          className={
            movie.isBookmarked
              ? "absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white"
              : "absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-sub"
          }
        >
          {movie.isBookmarked ? (
            <BookmarkIcon className="h-5 w-5" />
          ) : (
            <BookmarkOutlineIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="pt-[5px]">
        <h3 className="text-sm leading-[17px] font-extrabold text-ink">
          {movie.title}
        </h3>
      </div>

      <p className="text-xs leading-[14px] text-muted">{movie.releaseDate}</p>
    </article>
  );
}