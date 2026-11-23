import { Link } from "@tanstack/react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getFavorites } from "../../api/favorites/get-favorites";
import { getMe } from "../../api/members/me";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { ProfileAvatar } from "../../components/profile/profile-avatar";
import { useAuthStore } from "../../stores/auth-store";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { favoriteKeys } from "../../api/favorites/favorite-keys";

export function ProfilePage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const favoritesQuery = useQuery({
    queryKey: favoriteKeys.list,
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
  });

  const favorites = favoritesQuery.data ?? [];

  // 즐겨찾기 응답에 영화 정보가 없어서 TMDB 상세를 조회
  // (응답에 제목, 포스터가 있으면 이 블록을 지우고 favorites로 바로 그리기)
  const favoriteMovieQueries = useQueries({
    queries: favorites.map((favorite) => ({
      queryKey: ["movies", "detail", favorite.movieId],
      queryFn: () => getMovieDetail(favorite.movieId),
    })),
  });

  if (meQuery.isPending) {
    return (
      <main className='flex min-h-[50vh] items-center justify-center'>
        <p className='text-[#999999]'>내 정보를 불러오는 중이에요.</p>
      </main>
    );
  }

  if (meQuery.isError) {
    return (
      <main className='flex min-h-[50vh] items-center justify-center'>
        <p className='text-[#999999]'>내 정보를 불러오지 못했어요.</p>
      </main>
    );
  }

  const member = meQuery.data;

  return (
    <main className='bg-[#f7f7f8] px-10 pb-24 pt-10'>
      <div className='mx-auto max-w-6xl'>
        <div className='flex items-center justify-between'>
          <h1 className='text-4xl font-bold text-[#111111]'>내 정보</h1>
          <Link
            to='/profile/edit'
            className='rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white'
          >
            정보 수정
          </Link>
        </div>

        <hr className='my-8 border-[#e5e7eb]' />

        <section>
          <h2 className='mb-6 text-xl font-bold text-[#111111]'>기본 정보</h2>
          <div className='flex items-center gap-10'>
            <ProfileAvatar className='h-32 w-32' />
            <dl className='grid flex-1 grid-cols-2 gap-10'>
              <div>
                <dt className='text-xs text-[#9ca3af]'>닉네임</dt>
                <dd className='mt-1 text-lg font-bold text-[#111111]'>
                  {member.nickname}
                </dd>
              </div>
              <div>
                <dt className='text-xs text-[#9ca3af]'>이메일</dt>
                <dd className='mt-1 text-lg font-bold text-[#111111]'>
                  {member.email}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <hr className='my-8 border-[#e5e7eb]' />

        <section>
          <h2 className='mb-6 text-xl font-bold text-[#111111]'>내 즐겨찾기</h2>

          {favoritesQuery.isPending ? (
            <p className='text-[#999999]'>즐겨찾기를 불러오는 중이에요.</p>
          ) : favoritesQuery.isError ? (
            <p className='text-[#999999]'>즐겨찾기를 불러오지 못했어요.</p>
          ) : favorites.length === 0 ? (
            <p className='text-[#999999]'>즐겨찾기한 영화가 없어요.</p>
          ) : (
            <ul className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {favoriteMovieQueries.map((query, index) => {
                const movie = query.data;
                if (!movie) {
                  return (
                    <li
                      key={favorites[index].movieId}
                      className='text-sm text-[#999999]'
                    >
                      {query.isError
                        ? "불러오지 못했어요."
                        : "불러오는 중이에요."}
                    </li>
                  );
                }
                const posterUrl = getTmdbPosterUrl(movie.poster_path);
                return (
                  <li key={movie.id}>
                    <Link
                      to='/movies/$movieId'
                      params={{ movieId: String(movie.id) }}
                      className='block'
                    >
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={`${movie.title} 포스터`}
                          className='aspect-[2/3] w-full rounded-xl object-cover'
                        />
                      ) : (
                        <div className='flex aspect-[2/3] w-full items-center justify-center rounded-xl bg-[#e5e5e5] text-sm text-[#999999]'>
                          이미지 없음
                        </div>
                      )}
                      <p className='mt-2 font-bold text-[#111111]'>
                        {movie.title}
                      </p>
                      <p className='text-sm text-[#9ca3af]'>
                        {movie.release_date.replaceAll("-", ".")}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
