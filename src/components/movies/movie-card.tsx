import type { Movie } from "../../types/movie";
import "./movie-card.css";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-poster">
        <img src={movie.posterPath} alt={movie.title} />

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

      <h3 className="movie-title">{movie.title}</h3>

      <p className="movie-release-date">{movie.releaseDate}</p>
    </article>
  );
}

export default MovieCard;
