import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { readBookmarkIds, saveBookmarkIds } from "../../utils/bookmark-storage";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(() =>
    readBookmarkIds().includes(Number(movieId)),
  );

  if (!movie) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center text-lg text-gray-500">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  const handleToggleBookmark = () => {
    const bookmarkIds = readBookmarkIds();
    const nextBookmarkIds = isBookmarked
      ? bookmarkIds.filter((id) => id !== movie.id)
      : [...bookmarkIds, movie.id];

    saveBookmarkIds(nextBookmarkIds);
    setIsBookmarked(!isBookmarked);
  };

  return (
    <main className="min-h-screen bg-[#F6F7F9] text-gray-900 pb-16">
      <section className="relative h-[380px] w-full overflow-hidden bg-black text-white">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

        <div className="relative mx-auto flex h-full max-w-8xl flex-col justify-between px-25 py-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-300 hover:text-white transition-colors"
          >
            <img src="/icons/chevron-left.svg" alt="" className="h-6 w-6" />{" "}
            <p className="text-[13px] font-bold leading-none text-center align-middle">
              영화 목록
            </p>
          </Link>

          {/* 영화 주요 정보 */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold leading-tight tracking-[-1.5px] md:text-[46px] md:leading-[49.68px] md:tracking-[-2.3px]">
              {movie.title}
            </h1>
            <p className="mt-1 text-sm font-normal leading-none text-gray-300">
              {movie.originalTitle}
            </p>
            <p className="mt-2 text-xs font-bold leading-3 text-gray-400 md:text-[13px] md:leading-[13px]">
              {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
            </p>
          </div>
        </div>
      </section>

      {/* 본문 콘텐츠 영역 */}
      <section className="mx-auto mt-8 grid max-w-full grid-cols-1 gap-8 px-25 md:grid-cols-3 bg-[#F6F7F9]">
        <div className="flex flex-col gap-6 md:col-span-2 md:flex-row">
          {/* 포스터 */}
          <div className="shrink-0">
            <img
              src={movie.posterPath}
              alt={`${movie.title} 포스터`}
              className="w-48 rounded-lg shadow-lg md:w-56"
            />
          </div>

          {/* 상세 내용 */}
          <div className="flex flex-col justify-start space-y-4">
            {movie.tagline && (
              <h2 className="text-[21px] font-bold leading-[21px] tracking-[-0.63px] text-gray-800">
                {movie.tagline}
              </h2>
            )}
            <p className="whitespace-pre-line text-[13px] font-normal leading-5 text-gray-600 sm:text-[14px] sm:leading-6">
              {movie.overview}
            </p>

            {/* 즐겨찾기 버튼 */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleToggleBookmark}
                className="inline-flex items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm bg-[#2563EB]"
              >
                <img
                  src={
                    isBookmarked
                      ? "/icons/bookmark.svg"
                      : "/icons/bookmark-outline.svg"
                  }
                  alt=""
                  className="h-5 w-5 translate-y-[1px]"
                />
                <span className="leading-none">즐겨찾기</span>
              </button>
            </div>
          </div>
        </div>

        {/* 우측: 내 평점 입력 박스 */}
        <div className="border-l border-gray-200 pl-8 h-full">
          <h3 className="text-lg font-bold text-gray-900">내 평점</h3>
          <p className="mt-1 text-xs text-gray-400">
            별점은 필수, 후기는 선택이에요.
          </p>

          <div className="my-4 flex space-x-1 text-2xl text-[#606774]">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star}점`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={cn(
                  "rounded-lg border border-[#E3E6EB] bg-white px-1.5 py-1",
                  {
                    "text-yellow-400": star <= (hoverRating || rating),
                    "text-[#606774]": star > (hoverRating || rating),
                  },
                )}
              >
                ★
              </button>
            ))}
          </div>

          {/* 후기 입력 폼 */}
          <textarea
            rows={3}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="w-full resize-none rounded-md border border-[#E3E6EB] p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[#FFFFFF]"
          />

          <button
            type="button"
            className="mt-3 w-full rounded-md bg-[#17191E] py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            평점 저장
          </button>
        </div>
      </section>
    </main>
  );
}
