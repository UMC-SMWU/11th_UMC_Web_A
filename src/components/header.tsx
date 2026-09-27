import "./header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <a className="header__logo" href="/">
          <img src="/icons/logo.svg" alt="UMCine" />
          <span>UMCine</span>
        </a>
        <nav className="header__nav">
          <a className="header__nav-link header__nav-link--active" href="/">
            영화
          </a>
          <a className="header__nav-link" href="/">
            검색
          </a>
          <a className="header__nav-link" href="/">
            내 정보
          </a>
        </nav>
      </div>

      <div className="header__right">
        <button className="header__icon-button" type="button" aria-label="검색">
          <img src="/icons/search.svg" alt="" />
        </button>
        <button className="header__login-button" type="button">
          로그인
        </button>
      </div>
    </header>
  );
}
