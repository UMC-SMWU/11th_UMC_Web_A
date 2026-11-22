import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../../../../pages/movies/movie-list-page";

export const Route = createFileRoute("/(protected)/_authenticated/my/")({
  component: MovieListPage,
});
