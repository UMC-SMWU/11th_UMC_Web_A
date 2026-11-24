import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../views/movies/movie-list-page";

export const Route = createFileRoute("/")({
  component: MovieListPage,
});
