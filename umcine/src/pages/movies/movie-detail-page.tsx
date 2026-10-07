import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/bookmark-button";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="px-20 py-20 text-center text-sub">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main className="relative min-h-[calc(100vh-91px)] overflow-hidden">
      <img
        src={movie.backdropPath}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative flex flex-col gap-8 px-20 py-10 text-white">
        <Link to="/" className="w-fit text-sm font-bold text-white/80 hover:text-white">
          ← 영화 목록
        </Link>

        <div className="flex gap-10">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="h-[420px] w-[280px] shrink-0 rounded-[10px] object-cover"
          />
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-black">{movie.title}</h1>
              <BookmarkButton movieId={movie.id} movieTitle={movie.title} />
            </div>
            <p className="text-lg text-white/70">{movie.originalTitle}</p>
            <p className="text-sm text-white/70">
              {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
            </p>
            <h2 className="mt-6 text-xl font-bold">{movie.tagline}</h2>
            <p className="max-w-[640px] leading-7 text-white/90">{movie.overview}</p>
          </div>
        </div>
      </div>
    </main>
  );
}