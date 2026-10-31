import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const VISIBLE_PAGES = 5;

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // 현재 페이지 주변 5개만 보여줌
  const start = Math.max(
    1,
    Math.min(currentPage - 2, totalPages - VISIBLE_PAGES + 1),
  );
  const end = Math.min(totalPages, start + VISIBLE_PAGES - 1);
  const pageNumbers = Array.from(
    { length: end - start + 1 },
    (_, index) => start + index,
  );

  const baseClass =
    "h-8 w-8 cursor-pointer rounded-full border-none bg-transparent text-sm text-[#999999] hover:text-[#111111] disabled:cursor-default disabled:opacity-40";

  return (
    <nav
      className="flex items-center justify-center gap-2 py-10"
      aria-label="페이지 네비게이션"
    >
      <button
        type="button"
        className={baseClass}
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &lt;
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === currentPage ? "page" : undefined}
          className={cn(
            baseClass,
            page === currentPage &&
              "bg-blue-600 font-bold text-white hover:text-white",
          )}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className={baseClass}
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &gt;
      </button>
    </nav>
  );
}