export const favoriteKeys = {
  list: ["favorites", "list"] as const,
  detail: (movieId: number) => ["favorites", "detail", movieId] as const,
};