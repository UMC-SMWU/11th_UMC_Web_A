import { createFileRoute } from "@tanstack/react-router";
import { MovieDetailPage } from "../views/movies/movie-detail-page";

export const Route = createFileRoute("/movies/$movieId")({
  component: MovieDetailPage,
});
