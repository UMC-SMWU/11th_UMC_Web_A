import { useState } from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Footer from "./components/footer";
import { movies as initialMovies } from "./data/movies";
import "./App.css";

function App() {
  const [movies, setMovies] = useState(initialMovies);

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
    <>
      <Header />

      <main>
        <h2>영화 목록</h2>

        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
      </main>
      <Footer />
    </>
  );
}

export default App;
