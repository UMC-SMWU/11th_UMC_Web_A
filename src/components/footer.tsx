import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <img
        src="/images/logos/tmdb-logo.svg"
        alt="tmdb 로고"
        className="tmdb-logo"
      />
      <p>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}

export default Footer;
