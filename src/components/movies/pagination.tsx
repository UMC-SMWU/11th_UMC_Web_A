interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pagesPerGroup = 5;

  const startPage =
    Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;

  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );

  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="영화 목록 페이지"
      className="my-10 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
        className="flex h-10 w-10 items-center justify-center text-xl text-gray-500 disabled:cursor-not-allowed disabled:text-gray-200"
      >
        ‹
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? "page" : undefined}
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
            currentPage === page
              ? "bg-[#19191F] text-white"
              : "text-gray-500 hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
        className="flex h-10 w-10 items-center justify-center text-xl text-gray-500 disabled:cursor-not-allowed disabled:text-gray-200"
      >
        ›
      </button>
    </nav>
  );
}
