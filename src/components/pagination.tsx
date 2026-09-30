import "./pagination.css";

export default function Pagination() {
  const pageNumbers = [1, 2, 3, 4, 5];

  return (
    <nav className="pagination" aria-label="페이지 네비게이션">
      <button type="button" className="pagination__arrow" aria-label="이전 페이지">
        &lt;
      </button>
      {pageNumbers.map((page) => (
        <button
          key={page}
          type="button"
          className={`pagination__page ${page === 1 ? "pagination__page--active" : ""}`}
        >
          {page}
        </button>
      ))}
      <button type="button" className="pagination__arrow" aria-label="다음 페이지">
        &gt;
      </button>
    </nav>
  );
}