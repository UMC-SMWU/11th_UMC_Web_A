import "./header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <div className="header__logo">
          🎬 UMCine
        </div>
        <nav className="header__nav">
          <a href="#" className="header__nav-item header__nav-item--active">영화</a>
          <a href="#" className="header__nav-item">검색</a>
          <a href="#" className="header__nav-item">내 정보</a>
        </nav>
      </div>
      <div className="header__right">
        <button type="button" className="header__search" aria-label="검색">
          🔍
        </button>
        <button type="button" className="header__login">로그인</button>
      </div>
    </header>
  );
}