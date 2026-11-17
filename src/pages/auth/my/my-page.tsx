import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import Pagination from "@/components/movies/pagination";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

const PAGE_SIZE = 5;

export function MyPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 30_000,
  });

  const profile = accessToken ? data : undefined;
  const movieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(movieIds.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(1, totalPages));
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleIds = movieIds.slice(start, start + PAGE_SIZE);

  const movies = useQueries({
    queries: visibleIds.map((id) => ({
      queryKey: ["movies", "detail", id],
      queryFn: () => getMovieDetail(id),
      staleTime: 30_000,
    })),
  });

  return (
    <main className="min-h-[calc(100dvh-128px)] bg-[#f5f6f8] text-[#19191f]">
      <div className="mx-auto max-w-[1200px] px-4 py-6">
        <div className="flex items-center justify-between pb-6">
          <h1 className="text-2xl font-bold tracking-tight">내 정보</h1>
          <Link
            to="/my-edit"
            className="rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white"
          >
            정보 수정
          </Link>
        </div>

        <section className="border-y border-[#E3E6EB] py-4">
          <h2 className="mb-3 text-sm font-bold">기본 정보</h2>
          {!accessToken && <p>로그인이 필요해요.</p>}
          {accessToken && isLoading && <p>내 정보를 불러오는 중이에요.</p>}
          {accessToken && isError && <p>내 정보를 불러오지 못했어요.</p>}
          <div className="flex items-center gap-5">
            <div className="grid size-16 shrink-0 place-items-center rounded-full bg-[#E3E6EB]">
              <img src="/icons/person.svg" alt="" className="size-8" />
            </div>

            <dl className="grid flex-1 gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-gray-500">닉네임</dt>
                <dd className="mt-1 text-sm font-semibold">
                  {profile?.nickname ?? "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">이메일</dt>
                <dd className="mt-1 break-all text-sm font-semibold">
                  {profile?.email ?? "-"}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="pt-6">
          <h2 className="mb-3 text-sm font-bold">내 즐겨찾기</h2>

          {movieIds.length === 0 ? (
            <p className="text-sm text-gray-500">
              즐겨찾기에 추가한 영화가 없어요.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {movies.map((query, index) => {
                const movie = query.data;

                return (
                  <li key={visibleIds[index]}>
                    {movie ? (
                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                        className="block"
                      >
                        <div className="aspect-[7/8] overflow-hidden rounded-lg bg-gray-200">
                          {movie.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="grid h-full place-items-center text-xs text-gray-500">
                              포스터 없음
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2 text-sm font-semibold">
                          {movie.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                          {movie.release_date?.replaceAll("-", ".")}
                        </p>
                      </Link>
                    ) : (
                      <div className="grid aspect-[7/8] place-items-center rounded-lg bg-gray-100 p-3 text-center text-xs text-gray-500">
                        {query.isError
                          ? "영화 정보를 불러오지 못했어요."
                          : "영화 정보를 불러오는 중…"}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </section>
      </div>
    </main>
  );
}
