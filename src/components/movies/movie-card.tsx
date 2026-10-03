import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
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

          <button
            type="button"
            className="absolute right-2.5 top-2.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-black/55 text-white"
            onClick={(e) => {
              e.preventDefault(); // Link 안에 있으니 클릭 시 페이지 이동 막기
              onToggleBookmark(movie.id);
            }}
            aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          >
            <img
              src={
                movie.isBookmarked
                  ? "/icons/movie-icons/bookmark.svg"
                  : "/icons/movie-icons/bookmark-outline.svg"
              }
              alt=""
              className="h-4 w-4"
            />
          </button>
        </div>

        <p className="mt-1 text-left text-[15px] font-semibold text-[#111111]">
          {movie.title}
        </p>
      </Link>

      <p className="text-left text-[13px] text-[#999999]">{movie.releaseDate}</p>
    </div>
  );
}