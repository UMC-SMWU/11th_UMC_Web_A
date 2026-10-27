import type { TmdbMovieListItem } from "../../api/movies/models";
import { StatusMessage } from "../common/status-message";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
}

const gridClassName =
  "grid w-full grid-cols-1 gap-x-[18px] gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";

export function MovieGrid({ movies }: MovieGridProps) {
  if (movies.length === 0) {
    return <StatusMessage>조건에 맞는 영화가 없어요.</StatusMessage>;
  }

  return (
    <div className={gridClassName}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

// 로딩 중에는 카드와 같은 크기의 skeleton을 보여 줘서 화면이 덜 흔들려요.
export function MovieGridSkeleton() {
  return (
    <div className={gridClassName} role="status" aria-busy="true" aria-label="영화 목록을 불러오는 중이에요.">
      {Array.from({ length: 10 }, (_, index) => (
        <div key={index} className="flex w-full animate-pulse flex-col gap-1">
          <div className="h-[274px] w-full rounded-[10px] bg-line" />
          <div className="mt-[5px] h-3.5 w-3/4 rounded bg-line" />
          <div className="mt-1 h-3 w-1/3 rounded bg-line" />
        </div>
      ))}
      <span className="sr-only">영화 목록을 불러오는 중이에요.</span>
    </div>
  );
}
