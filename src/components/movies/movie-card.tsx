import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
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
        <button
          type="button"
          className="absolute top-2.5 right-2.5 flex size-[34px] cursor-pointer items-center justify-center rounded-lg border border-white bg-ink/45 px-1.5 py-[7.5px] transition hover:bg-ink/65 active:scale-95"
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="size-[18px]"
            src={movie.isBookmarked ? "/icons/bookmark-filled.svg" : "/icons/bookmark-outline.svg"}
            alt=""
          />
        </button>
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
