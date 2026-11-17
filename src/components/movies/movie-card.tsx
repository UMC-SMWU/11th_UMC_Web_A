import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tndb-image";
import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex w-full flex-col">
      <div className="relative w-full">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {getTmdbPosterUrl(movie.poster_path) ? (
            <img
              className="block aspect-[241.6/274] w-full rounded-lg object-cover"
              src={getTmdbPosterUrl(movie.poster_path)!}
              alt={movie.title}
            />
          ) : (
            <div className="flex aspect-[241.6/274] w-full items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-500">
              이미지 없음
            </div>
          )}
        </Link>

        <BookmarkButton movieId={movie.id} />
      </div>

      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h2 className="mt-[5px] m-0 text-left font-['Pretendard'] text-sm font-extrabold leading-none tracking-normal text-[#17191e]">
          {movie.title}
        </h2>
      </Link>

      <p className="mt-1 w-full text-left font-['Pretendard'] text-xs font-normal leading-none text-[#969da8]">
        {movie.release_date}
      </p>
    </article>
  );
}
