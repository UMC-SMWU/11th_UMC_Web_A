import Image from "next/image";
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

  // next/image의 fill은 부모 크기에 맞춰 채워서, className은 크기를 정하는 바깥 div에 적용해요.
  // sizes는 화면에서 차지하는 너비를 알려 줘서 필요한 크기의 이미지만 받게 해요.
  return (
    <div className={cn("relative block overflow-hidden", className)}>
      <Image
        className="object-cover"
        src={posterUrl}
        alt={`${title} 포스터`}
        fill
        sizes="(min-width: 768px) 300px, 220px"
        loading={loading}
      />
    </div>
  );
}
