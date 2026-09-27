import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  const [rating, setRating] = useState(0);

  if (!movie) {
    return <main>영화를 찾을 수 없어요.</main>;
  }

  return (
    <main>
      {/* 상단 영화 소개 영역 */}
      <section className="relative h-[360px] w-full overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 mx-auto h-full max-w-[1248px] text-white">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="absolute top-6 flex items-center gap-1 text-[13px] font-bold leading-none"
          >
            <img
              src="/icons/chevron-left.svg"
              alt=""
              aria-hidden="true"
              className="h-5 w-5 brightness-0 invert"
            />
            <span>영화목록</span>
          </button>

          <div className="absolute bottom-7 left-0">
            <h1 className="text-[46px] font-bold leading-[49.68px] tracking-[-2.3px] text-white">
              {movie.title}
            </h1>

            <p className="mt-3 text-[16px]">{movie.originalTitle}</p>

            <div className="mt-3 flex items-center gap-2 text-[13px] font-weight">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 영화 상세 영역 */}
      <section className="mx-auto flex max-w-[1280px] gap-8 py-8">
        {/* 포스터 */}
        <div className="w-[200px] shrink-0">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="w-full rounded-xl object-cover"
          />
        </div>

        {/* 영화설명 */}
        <div className="flex-1">
          <h2 className="text-[24px] font-bold">{movie.tagline}</h2>
          <p className="mt-3 whitespace-pre-line text-[16px] leading-7 text-gray-600">
            {movie.overview}
          </p>
          <button
            type="button"
            className="mt-5 flex items-center gap-2 rounded-[12px] bg-[#4F64E8] px-[17px] py-[13px] font-bold text-white"
          >
            <img
              src="/icons/bookmark-outline.svg"
              alt=""
              aria-hidden="true"
              className="h-[17px] w-[17px] brightness-0 invert"
            />
            <span className="text-[17px] leading-none">즐겨찾기</span>
          </button>
        </div>

        {/*평점 영역*/}
        <aside className="w-[472px] shrink-0 border-l border-gray-200 pl-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-[21px] font-bold"> 내 평점</h2>
            <p className="mt-2 text-[12px] text-gray-400">
              별점은 필수, 후기는 선택이에요.
            </p>

            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setRating(score)}
                  className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-white"
                >
                  <img
                    src={
                      score <= rating
                        ? "/icons/star.svg"
                        : "/icons/star-outline .svg"
                    }
                    alt={`${score}점`}
                    className="h-6 w-6"
                  />
                </button>
              ))}
            </div>

            <textarea
              placeholder="영화를 보고 느낀 점을 남겨보세요."
              className="mt-3 h-[140px] w-full resize-none rounded-lg border border-gray-200 p-4 text-[14px] outline-none"
            />
            <button
              type="button"
              className="mt-3 w-full rounded-lg bg-[#19191D] py-3 font-bold text-white"
            >
              평점 저장
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
