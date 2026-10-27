import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <article className="flex flex-col gap-1">
      <div className="relative h-[274px] overflow-hidden rounded-[10px] bg-canvas">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block size-full"
        >
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-sub">
              이미지 없음
            </div>
          )}
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

      <p className="text-xs leading-[14px] text-muted">{movie.release_date}</p>
    </article>
  );
}