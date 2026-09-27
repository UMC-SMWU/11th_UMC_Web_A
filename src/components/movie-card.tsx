import type { Movie } from "../types/movie";
import "./movie-card.css";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster">
        <img
          className="poster__image"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          loading="lazy"
        />
        <button
          type="button"
          className="poster__bookmark"
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={movie.isBookmarked ? "/icons/bookmark-filled.svg" : "/icons/bookmark-outline.svg"}
            alt=""
          />
        </button>
      </div>

      <div className="movie-title">{movie.title}</div>
      <div className="movie-date">{movie.releaseDate}</div>
    </article>
  );
}