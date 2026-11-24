// TMDB 출처 표기예요. 제공된 디자인에 TMDB 로고 이미지가 있다면 이 영역에 함께 넣어 주세요.
export function TmdbAttribution() {
  return (
    <footer className="border-t border-line bg-white px-5 py-6 md:px-20">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-1 text-xs leading-5 text-muted">
        <p>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            className="font-bold text-subtle underline hover:text-brand"
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
          >
            TMDB
          </a>
          .
        </p>
        <p>이 서비스는 TMDB API를 사용하지만 TMDB의 보증이나 인증을 받은 것은 아니에요.</p>
      </div>
    </footer>
  );
}
