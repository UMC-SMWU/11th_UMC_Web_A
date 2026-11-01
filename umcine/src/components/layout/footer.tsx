export function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto flex h-[57px] max-w-[1440px] items-center justify-end gap-2 px-20">
        <img
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="h-2.5 w-6"
        />
        <p className="text-xs text-sub">
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            href="https://www.themoviedb.org/?language=ko"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
}