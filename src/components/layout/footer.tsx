function Footer() {
  return (
    <footer className="flex w-full items-center justify-end gap-2 border-t border-[#eeeeee] bg-white px-5 py-2.5">
      <img
        src="/images/logos/tmdb-logo.svg"
        alt="tmdb 로고"
        className="h-auto w-[50px]"
      />
      <p className="m-0 text-xs text-[#888888]">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}

export default Footer;
