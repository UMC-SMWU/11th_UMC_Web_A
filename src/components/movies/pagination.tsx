import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="flex items-center justify-center gap-2 pt-8" aria-label="페이지 이동">
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            "size-9 cursor-pointer rounded-lg border text-sm font-semibold",
            page === currentPage
              ? "border-brand bg-brand text-white"
              : "border-line bg-white text-subtle hover:border-brand hover:text-brand",
          )}
          aria-current={page === currentPage ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}
