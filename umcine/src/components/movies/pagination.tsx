import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onChangePage,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <nav aria-label="페이지 이동" className="flex h-9 items-center justify-center gap-3">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={isFirstPage}
        onClick={() => onChangePage(currentPage - 1)}
        className="disabled:opacity-50"
      >
        <img src="/icons/movie-icons/chevron-left.svg" alt="" aria-hidden="true" className="size-6" />
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onChangePage(page)}
            className={cn(
              "size-9 rounded-[7px] text-[13px] leading-4 font-bold",
              page === currentPage ? "bg-ink text-white" : "bg-white text-sub",
            )}
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
        className="disabled:opacity-50"
      >
        <img src="/icons/movie-icons/chevron-right.svg" alt="" aria-hidden="true" className="size-6" />
      </button>
    </nav>
  );
}