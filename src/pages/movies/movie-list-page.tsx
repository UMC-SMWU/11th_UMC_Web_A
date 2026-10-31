import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

interface MovieListResult {
  page: number;
  movies: TmdbMovieListItem[];
  errorMessage: string | null;
}

const CURRENT_PAGE = 1;

export default function MovieListPage() {
  const [result, setResult] = useState<MovieListResult | null>(null);

  useEffect(() => {
    let ignore = false;

    getMovies({ page: CURRENT_PAGE })
      .then((response) => {
        if (!ignore) {
          setResult({
            page: CURRENT_PAGE,
            movies: response.results,
            errorMessage: null,
          });
        }
      })
      .catch(() => {
        if (!ignore) {
          setResult({
            page: CURRENT_PAGE,
            movies: [],
            errorMessage: "영화 목록을 불러오지 못했어요.",
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // 현재 페이지의 결과일 때만 사용하고, 로딩은 계산으로 판단
  const currentResult = result?.page === CURRENT_PAGE ? result : null;
  const isLoading = currentResult === null;
  const movies = currentResult?.movies ?? [];
  const errorMessage = currentResult?.errorMessage ?? null;

  return (
    <main className="bg-[#f7f7f8] px-10 pb-[60px] pt-8">
      <h1 className="mb-6 text-2xl font-bold text-[#111111]">영화 목록</h1>
      {isLoading ? (
        <p className="text-[#999999]">영화 목록을 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p className="text-[#999999]">{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p className="text-[#999999]">조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination />
        </>
      )}
    </main>
  );
}