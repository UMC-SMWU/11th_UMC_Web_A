import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block"
        >
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="block aspect-[2/3] w-full rounded-lg object-cover"
            />
          ) : (
            <div className="flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-[#e5e5e5] text-sm text-[#999999]">
              이미지 없음
            </div>
          )}
        </Link>

        <BookmarkButton
          movieId={movie.id}
          className="absolute right-2.5 top-2.5 h-8 w-8 bg-black/55 text-white"
        />
      </div>

      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="mt-1 text-left text-[15px] font-semibold text-[#111111] no-underline"
      >
        {movie.title}
      </Link>

      <p className="text-left text-[13px] text-[#999999]">
        {movie.release_date.replaceAll("-", ".")}
      </p>
    </div>
  );
}