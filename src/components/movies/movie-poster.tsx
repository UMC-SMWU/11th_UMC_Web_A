import { cn } from "../../utils/cn";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

interface MoviePosterProps {
  posterPath: string | null;
  title: string;
  className?: string;
  loading?: "lazy" | "eager";
}

// poster_path가 없으면 같은 크기의 회색 영역에 "이미지 없음"을 보여 줘요.
export function MoviePoster({ posterPath, title, className, loading }: MoviePosterProps) {
  const posterUrl = getTmdbPosterUrl(posterPath);

  if (!posterUrl) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-line text-xs font-medium text-muted",
          className,
        )}
      >
        이미지 없음
      </div>
    );
  }

  return (
    <img
      className={cn("block object-cover", className)}
      src={posterUrl}
      alt={`${title} 포스터`}
      loading={loading}
    />
  );
}
