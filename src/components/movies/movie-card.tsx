import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="w-full">
      <div className="relative aspect-[11/16] w-full overflow-hidden rounded-lg">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            className="block h-full w-full object-cover"
            src={movie.posterPath}
            alt={movie.title}
          />
        </Link>

        <button
          type="button"
          className="absolute top-3 right-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white bg-black/60 text-xl text-white"
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="h-7 w-7"
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt={movie.isBookmarked ? "북마크 해제" : "북마크"}
          />
        </button>
      </div>

      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h3 className="mt-3 mb-1 text-base font-semibold text-[#222222]">
          {movie.title}
        </h3>
      </Link>

      <p className="m-0 text-sm text-[#888888]">{movie.releaseDate}</p>
    </article>
  );
}

export default MovieCard;
