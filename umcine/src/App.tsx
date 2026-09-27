import { useState } from "react";
import Footer from "./components/footer";
import Header, { type Menu } from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import { movies as initialMovies } from "./data/movies";

export default function App() {
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState<Menu>("영화");

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header
        activeMenu={activeMenu}
        onSelectMenu={setActiveMenu}
        onClickSearch={() => setActiveMenu("검색")}
        onClickLogin={() => console.log("로그인 페이지는 다음 주차에 연결해요.")}
      />

      <main className="flex flex-1 flex-col gap-7 px-20 py-6">
        <h1 className="text-[31px] leading-[37px] font-bold tracking-[-1.24px] text-ink">
          {activeMenu}
        </h1>

        {activeMenu === "영화" ? (
          <>
            <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
            <Pagination
              currentPage={currentPage}
              totalPages={1}
              onChangePage={setCurrentPage}
            />
          </>
        ) : (
          <p className="text-sm text-sub">이 화면은 다음 주차에 만들어요.</p>
        )}
      </main>

      <Footer />
    </div>
  );
}