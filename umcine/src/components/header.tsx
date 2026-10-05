import { MovieIcon, SearchIcon } from "./icons";

export const MENUS = ["영화", "검색", "내 정보"] as const;

export type Menu = (typeof MENUS)[number];

interface HeaderProps {
  activeMenu: Menu;
  onSelectMenu: (menu: Menu) => void;
  onClickSearch: () => void;
  onClickLogin: () => void;
}

export default function Header({
  activeMenu,
  onSelectMenu,
  onClickSearch,
  onClickLogin,
}: HeaderProps) {
  return (
    <header className="flex h-[91px] items-center justify-between bg-white px-20 py-6">
      <div className="flex items-center gap-[42px]">
        <button
          type="button"
          onClick={() => onSelectMenu("영화")}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink">
            <MovieIcon className="h-6 w-6 text-ink" />
          </span>
          <span className="text-xl leading-6 font-black tracking-[-0.7px] text-ink">
            UMCine
          </span>
        </button>

        <nav className="flex items-center gap-[30px]">
          {MENUS.map((menu) => (
            <button
              key={menu}
              type="button"
              onClick={() => onSelectMenu(menu)}
              className={
                menu === activeMenu
                  ? "text-sm leading-[17px] font-bold text-ink underline"
                  : "text-sm leading-[17px] font-bold text-sub"
              }
            >
              {menu}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          aria-label="영화 검색"
          onClick={onClickSearch}
          className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-line bg-white"
        >
          <SearchIcon className="h-6 w-6 text-sub" />
        </button>
        <button
          type="button"
          onClick={onClickLogin}
          className="flex h-[42px] items-center justify-center rounded-lg bg-primary px-4 text-sm leading-[17px] font-extrabold text-white"
        >
          로그인
        </button>
      </div>
    </header>
  );
}