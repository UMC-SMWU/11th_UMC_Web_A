import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import "./movie-card.css";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-poster">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img src={movie.posterPath} alt={movie.title} />
        </Link>

        <button
          type="button"
          className="bookmark-button"
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt={movie.isBookmarked ? "북마크 해제" : "북마크"}
          />
        </button>
      </div>

      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}></Link>

      <h3 className="movie-title">{movie.title}</h3>

      <p className="movie-release-date">{movie.releaseDate}</p>
    </article>
  );
}

export default MovieCard;
