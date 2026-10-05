import { cn } from "../../utils/cn";

export default function Pagination() {
  const pageNumbers = [1, 2, 3, 4, 5];

  return (
    <nav
      className="flex items-center justify-center gap-2 py-10"
      aria-label="페이지 네비게이션"
    >
      <button
        type="button"
        className="h-8 w-8 cursor-pointer rounded-full border-none bg-transparent text-sm text-[#999999] hover:text-[#111111]"
        aria-label="이전 페이지"
      >
        &lt;
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            "h-8 w-8 cursor-pointer rounded-full border-none bg-transparent text-sm text-[#999999] hover:text-[#111111]",
            page === 1 && "bg-blue-600 font-bold text-white hover:text-white",
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="h-8 w-8 cursor-pointer rounded-full border-none bg-transparent text-sm text-[#999999] hover:text-[#111111]"
        aria-label="다음 페이지"
      >
        &gt;
      </button>
    </nav>
  );
}