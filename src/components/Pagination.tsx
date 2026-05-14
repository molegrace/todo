import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;
  const pageButtonClass =
    "rounded-xl border px-3 py-1.5 text-sm font-medium transition";
  const disabledButtonClass =
    "cursor-not-allowed border-main-200 bg-main-100 text-main-400";
  const iconClass = "h-4 w-4";

  return (
    <div className="flex max-w-full flex-wrap justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        aria-label="Previous page"
        className={`${pageButtonClass} ${
          isFirstPage
            ? disabledButtonClass
            : "border-main-200 bg-white text-main-600 hover:bg-main-50"
        }`}
      >
        <svg
          aria-hidden="true"
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPageChange(i + 1)}
          className={`${pageButtonClass} ${
            currentPage === i + 1
              ? "border-main-700 bg-main-700 text-white"
              : "border-main-200 bg-white text-main-600 hover:bg-main-50"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        aria-label="Next page"
        className={`${pageButtonClass} ${
          isLastPage
            ? disabledButtonClass
            : "border-main-200 bg-white text-main-600 hover:bg-main-50"
        }`}
      >
        <svg
          aria-hidden="true"
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
