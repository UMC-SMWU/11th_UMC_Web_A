import { TmdbLogo } from "./icons";

export default function Footer() {
  return (
    <footer className="flex h-[57px] items-center justify-end gap-2 bg-white px-20 py-4">
      <TmdbLogo className="h-[14px] w-auto" />
      <p className="text-xs leading-[14px] text-sub">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}