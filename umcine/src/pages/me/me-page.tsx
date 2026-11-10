import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { useBookmarkStore } from "../../stores/bookmark-store";

// 8주차에서 내 정보 조회 API로 교체
const MOCK_ME = {
  nickname: "gs0428",
  email: "gwangsoo@cinemalab.kr",
};

// 5개씩 2줄
const BOOKMARKS_PER_PAGE = 10;

export function MePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);

  const totalPages = Math.max(
    1,
    Math.ceil(bookmarkedMovieIds.length / BOOKMARKS_PER_PAGE),
  );
  // 북마크를 해제해 페이지가 줄어도 마지막 페이지를 넘지 않게
  const page = Math.min(currentPage, totalPages);
  const pageMovieIds = bookmarkedMovieIds.slice(
    (page - 1) * BOOKMARKS_PER_PAGE,
    page * BOOKMARKS_PER_PAGE,
  );

  // 즐겨찾기한 영화 상세 정보를 한 번에 요청 (상세 페이지와 같은 queryKey라 캐시 공유)
  const movieQueries = useQueries({
    queries: pageMovieIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
      staleTime: 30 * 1000,
    })),
  });

  const isPending = movieQueries.some((query) => query.isPending);
  const isError = movieQueries.some((query) => query.isError);

  // MovieCard가 목록 응답 형태를 받으므로 상세 응답을 맞춰서 전달
  const movies: TmdbMovieListItem[] = movieQueries.flatMap((query) =>
    query.data
      ? [{ ...query.data, genre_ids: query.data.genres.map((genre) => genre.id) }]
      : [],
  );

  return (
    <main className="mx-auto w-full max-w-[1440px] px-20 pt-6 pb-16">
      <div className="flex items-center justify-between pb-7">
        <h1 className="text-[32px] font-bold text-ink">내 정보</h1>
        <Link
          to="/me/edit"
          className="flex h-[42px] items-center rounded-lg bg-primary px-4 text-sm font-extrabold text-white"
        >
          정보 수정
        </Link>
      </div>

      <section className="border-y border-line py-5">
        <h2 className="mb-4 text-base font-bold text-ink">기본 정보</h2>
        <div className="flex items-center">
          <div className="flex size-[82px] shrink-0 items-center justify-center rounded-full bg-line">
            <img
              src="/icons/movie-icons/person.svg"
              alt=""
              aria-hidden="true"
              className="size-12"
            />
          </div>

          <dl className="ml-7 grid flex-1 grid-cols-[394px_1fr]">
            <div>
              <dt className="text-[11px] text-muted">닉네임</dt>
              <dd className="mt-1.5 text-[15px] font-bold text-ink">
                {MOCK_ME.nickname}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted">이메일</dt>
              <dd className="mt-1.5 text-[15px] font-bold text-ink">
                {MOCK_ME.email}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="pt-8">
        <h2 className="mb-4 text-base font-bold text-ink">내 즐겨찾기</h2>

        {bookmarkedMovieIds.length === 0 ? (
          <p className="text-sm text-sub">즐겨찾기한 영화가 없어요.</p>
        ) : isPending ? (
          <p className="text-sm text-sub">즐겨찾기한 영화를 불러오는 중이에요.</p>
        ) : isError ? (
          <p className="text-sm text-sub">즐겨찾기한 영화를 불러오지 못했어요.</p>
        ) : (
          <div className="flex flex-col gap-10">
            <MovieGrid movies={movies} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onChangePage={setCurrentPage}
            />
          </div>
        )}
      </section>
    </main>
  );
}