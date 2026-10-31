import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";

interface SearchMoviesParams {
  query: string;
  page?: number;
}

export function searchMovies({ query, page = 1 }: SearchMoviesParams) {
  return tmdbClient
    .get("search/movie", { searchParams: { query, page } })
    .json<TmdbMovieListResponse>();
}