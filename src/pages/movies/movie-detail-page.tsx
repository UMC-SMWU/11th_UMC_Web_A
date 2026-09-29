import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-start gap-4 px-5 py-10 md:px-20">
        <p className="text-lg font-bold text-ink">영화를 찾을 수 없어요.</p>
        <Link to="/" className="text-sm font-bold text-brand hover:text-brand-hover">
          영화 목록
        </Link>
      </main>
    );
  }

  return (
    <main className="relative isolate flex-1 overflow-hidden bg-ink text-white">
      <img
        className="absolute inset-0 -z-20 size-full object-cover"
        src={movie.backdropPath}
        alt=""
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink via-ink/75 to-ink/30" />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 py-8 md:flex-row md:gap-12 md:px-20 md:py-14">
        <div className="flex shrink-0 flex-col items-start gap-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white"
          >
            <img className="size-5 invert" src="/icons/chevron-left.svg" alt="" />
            영화 목록
          </Link>
          <img
            className="aspect-[2/3] w-[220px] rounded-[10px] object-cover shadow-2xl md:w-[300px]"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 md:pt-12">
          <h1 className="text-[32px] leading-tight font-bold tracking-tight md:text-[44px]">
            {movie.title}
          </h1>
          <p className="text-base text-white/70">{movie.originalTitle}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/80">
            <p>{movie.releaseDate}</p>
            <p>{movie.genres.join(" · ")}</p>
            <p>{movie.runtime}</p>
          </div>
          <h2 className="mt-6 text-xl font-bold">{movie.tagline}</h2>
          <p className="max-w-[640px] text-base leading-7 text-white/85">{movie.overview}</p>
        </div>
      </div>
    </main>
  );
}
