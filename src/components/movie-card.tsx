import "./movie-card.css";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="movie-card__poster-wrapper">
        <img
          src={movie.posterPath}
          alt={movie.title}
          className="movie-card__poster"
        />
        <button
          type="button"
          className="movie-card__bookmark"
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
        >
          {movie.isBookmarked ? "🔖" : "📑"}
        </button>
      </div>
      <p className="movie-card__title">{movie.title}</p>
      <p className="movie-card__date">{movie.releaseDate}</p>
    </div>
  );
}