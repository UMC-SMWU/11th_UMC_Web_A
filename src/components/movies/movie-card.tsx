import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="flex w-full flex-col">
      <div className="relative w-full">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            className="block aspect-[241.6/274] w-full rounded-lg object-cover"
            src={movie.posterPath}
            alt={movie.title}
          />
        </Link>

        <button
          className={cn(
            "absolute right-3 top-3 flex h-[34px] w-[34px] items-center justify-center rounded-lg p-0 cursor-pointer",
            movie.isBookmarked
              ? "border-0 bg-blue-600"
              : "border border-white bg-[#17191e]",
          )}
          type="button"
          aria-label={`${movie.title} 북마크`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="h-6 w-6 brightness-0 invert"
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
          />
        </button>
      </div>

      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h2 className="mt-[5px] m-0 text-left font-['Pretendard'] text-sm font-extrabold leading-none tracking-normal text-[#17191e]">
          {movie.title}
        </h2>
      </Link>

      <p className="mt-1 w-full text-left font-['Pretendard'] text-xs font-normal leading-none text-[#969da8]">
        {movie.releaseDate}
      </p>
    </article>
  );
}
