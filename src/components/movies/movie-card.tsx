import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

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