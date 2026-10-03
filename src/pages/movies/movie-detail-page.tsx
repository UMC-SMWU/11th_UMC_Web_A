import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-[#999999]">영화를 찾을 수 없어요.</p>
      </main>
    );
  }

  return (
    <main>
      {/* 배경 이미지 + 타이틀 오버레이 */}
      <div className="relative h-80 w-full overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <Link
          to="/"
          className="absolute left-10 top-6 flex items-center gap-1 text-sm text-white/80 hover:text-white"
        >
          <span aria-hidden="true">‹</span> 영화 목록
        </Link>

        <div className="absolute bottom-6 left-10 right-10 text-white">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="mt-1 text-sm text-white/80">{movie.originalTitle}</p>
          <p className="mt-1 text-sm text-white/80">
            {movie.releaseDate} &nbsp;{movie.genres.join(" · ")} &nbsp;{movie.runtime}
          </p>
        </div>
      </div>

      {/* 포스터 + 줄거리 */}
      <div className="flex flex-col gap-10 px-10 py-10 lg:flex-row">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="w-40 shrink-0 rounded-lg object-cover"
        />

        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#111111]">{movie.tagline}</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#333333]">
            {movie.overview}
          </p>
          <button
            type="button"
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            🔖 즐겨찾기
          </button>
        </div>
      </div>
    </main>
  );
}