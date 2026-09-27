import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onChangePage,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <nav className="flex h-9 items-center justify-center gap-3">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={isFirstPage}
        onClick={() => onChangePage(currentPage - 1)}
        className="text-page-arrow disabled:opacity-50"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onChangePage(page)}
            className={
              page === currentPage
                ? "h-9 w-9 rounded-[7px] bg-ink text-[13px] leading-4 font-bold text-white"
                : "h-9 w-9 rounded-[7px] bg-white text-[13px] leading-4 font-bold text-sub"
            }
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={isLastPage}
        onClick={() => onChangePage(currentPage + 1)}
        className="text-page-arrow disabled:opacity-50"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>
    </nav>
  );
}