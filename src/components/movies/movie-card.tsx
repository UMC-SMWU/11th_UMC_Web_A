import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="block text-inherit no-underline"
      >
        <div className="relative">
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="block aspect-[2/3] w-full rounded-lg object-cover"
          />
          <BookmarkButton
            movieId={movie.id}
            className="absolute right-2.5 top-2.5 h-8 w-8 bg-black/55 text-white"
          />
        </div>

        <p className="mt-1 text-left text-[15px] font-semibold text-[#111111]">
          {movie.title}
        </p>
      </Link>

      <p className="text-left text-[13px] text-[#999999]">{movie.releaseDate}</p>
    </div>
  );
}