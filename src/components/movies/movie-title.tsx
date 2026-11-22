import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";

// 영화 ID만 가진 즐겨찾기·평점 목록에서 제목을 보여 줘요. 같은 영화는 캐시를 같이 써요.
export function MovieTitle({ movieId }: { movieId: number }) {
  const { data } = useQuery({
    queryKey: ["movies", movieId],
    queryFn: () => getMovieDetail(movieId),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Link
      to="/movies/$movieId"
      params={{ movieId: String(movieId) }}
      className="font-bold text-ink hover:text-brand"
    >
      {data?.title ?? `영화 ${movieId}`}
    </Link>
  );
}
