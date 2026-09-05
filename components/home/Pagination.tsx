'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | '...')[] = [];
  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', total);
  } else if (current >= total - 3) {
    pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total);
  }
  return pages;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-1"
    >
      {/* Previous button */}
      <button
        onClick={() => navigateTo(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
          ${
            currentPage <= 1
              ? 'opacity-30 cursor-not-allowed text-nordic-muted dark:text-hint-of-green/40'
              : 'text-nordic-dark dark:text-hint-of-green hover:bg-white dark:hover:bg-white/10 hover:shadow-sm border border-transparent hover:border-nordic-dark/10 dark:hover:border-white/10'
          }`}
      >
        <span className="material-icons text-[18px]">chevron_left</span>
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, idx) =>
          page === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-9 h-9 flex items-center justify-center text-nordic-muted dark:text-hint-of-green/40 text-sm select-none"
            >
              &hellip;
            </span>
          ) : (
            <button
              key={page}
              onClick={() => navigateTo(page as number)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all cursor-pointer
                ${
                  page === currentPage
                    ? 'bg-nordic-dark text-white dark:bg-hint-of-green dark:text-nordic-dark shadow-sm'
                    : 'text-nordic-dark dark:text-hint-of-green hover:bg-white dark:hover:bg-white/10 hover:shadow-sm border border-transparent hover:border-nordic-dark/10 dark:hover:border-white/10'
                }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next button */}
      <button
        onClick={() => navigateTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
          ${
            currentPage >= totalPages
              ? 'opacity-30 cursor-not-allowed text-nordic-muted dark:text-hint-of-green/40'
              : 'text-nordic-dark dark:text-hint-of-green hover:bg-white dark:hover:bg-white/10 hover:shadow-sm border border-transparent hover:border-nordic-dark/10 dark:hover:border-white/10'
          }`}
      >
        <span className="hidden sm:inline">Next</span>
        <span className="material-icons text-[18px]">chevron_right</span>
      </button>
    </nav>
  );
};
