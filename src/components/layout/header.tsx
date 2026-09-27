import "./header.css";
import { Link } from "@tanstack/react-router";

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <h1 className="logo">
            <img src="/icons/movie.svg" alt="" className="logo-svg" />
            UMCine
          </h1>

          <nav className="header-nav">
            <Link to="/" className="active">
              영화
            </Link>
            <Link to="/search">검색</Link>
            {/* <Link to="/search">내 정보</Link> */}
          </nav>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <button type="button" className="search-button">
              <img src="/icons/search.svg" alt="검색" />
            </button>
          </div>

          <button type="button" className="login-button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
