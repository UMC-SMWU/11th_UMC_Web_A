import { movies } from "../../data/movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export default function MovieListPage() {
  return (
    <main className="bg-[#f7f7f8] px-10 pb-[60px] pt-8">
      <h1 className="mb-6 text-2xl font-bold text-[#111111]">영화 목록</h1>
      <MovieGrid movies={movies} />
      <Pagination />
    </main>
  );
}