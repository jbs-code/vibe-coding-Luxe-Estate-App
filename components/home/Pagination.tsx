'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total?: number;
  pageSize?: number;
}

/**
 * Dynamically computes visible page numbers and ellipses based on current window width / max visible count
 */
function getDynamicPageNumbers(
  current: number,
  total: number,
  maxVisibleButtons: number
): (number | '...')[] {
  if (total <= maxVisibleButtons) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Very small screens (max 3 visible buttons: e.g. < 480px)
  if (maxVisibleButtons <= 3) {
    if (current === 1) return [1, 2, '...', total];
    if (current === total) return [1, '...', total - 1, total];
    return ['...', current, '...'];
  }

  // Mobile screens (max 5 visible buttons: e.g. 480px - 768px)
  if (maxVisibleButtons <= 5) {
    if (current <= 3) {
      return [1, 2, 3, '...', total];
    }
    if (current >= total - 2) {
      return [1, '...', total - 2, total - 1, total];
    }
    return [1, '...', current, '...', total];
  }

  // Desktop / Large screens (max 7-9 visible buttons: e.g. >= 768px)
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total];
  }
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  total,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const { t, interpolate } = useLanguage();

  // Track window width dynamically for responsive pagination
  const [windowWidth, setWindowWidth] = useState<number>(1024);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize(); // set initial size
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigateTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });

    // Smooth scroll to market section on page change
    const marketEl = document.getElementById('market-properties-section');
    if (marketEl) {
      marketEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (totalPages <= 1) return null;

  // Determine max visible buttons based on dynamic window width
  let maxVisibleButtons = 7;
  let isSmallMobile = false;
  let isMobile = false;

  if (mounted) {
    if (windowWidth < 480) {
      maxVisibleButtons = 3;
      isSmallMobile = true;
      isMobile = true;
    } else if (windowWidth < 768) {
      maxVisibleButtons = 5;
      isMobile = true;
    } else if (windowWidth < 1280) {
      maxVisibleButtons = 7;
    } else {
      maxVisibleButtons = 9;
    }
  }

  const pageNumbers = getDynamicPageNumbers(currentPage, totalPages, maxVisibleButtons);

  return (
    <nav
      aria-label={t.pagination.ariaLabel}
      className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-nordic-dark/5 dark:border-white/10 pt-6"
    >
      {/* Dynamic Results info */}
      <div className="text-xs sm:text-sm text-nordic-muted dark:text-hint-of-green/70 text-center sm:text-left">
        {t.pagination.showingPage}{' '}
        <span className="font-semibold text-nordic-dark dark:text-white">{currentPage}</span>{' '}
        {t.pagination.of}{' '}
        <span className="font-semibold text-nordic-dark dark:text-white">{totalPages}</span>
        {total !== undefined && total > 0 && (
          <span className="hidden md:inline"> {interpolate(t.pagination.totalProperties, { total })}</span>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
        {/* First page button on larger screens */}
        {!isMobile && totalPages > 5 && (
          <button
            onClick={() => navigateTo(1)}
            disabled={currentPage <= 1}
            aria-label={t.pagination.firstPage}
            title={t.pagination.firstPage}
            className={`hidden lg:flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all cursor-pointer
              ${
                currentPage <= 1
                  ? 'opacity-30 cursor-not-allowed text-nordic-muted dark:text-hint-of-green/40'
                  : 'text-nordic-dark dark:text-hint-of-green hover:bg-white dark:hover:bg-white/10 hover:shadow-sm border border-transparent hover:border-nordic-dark/10 dark:hover:border-white/10'
              }`}
          >
            <span className="material-icons text-base">first_page</span>
          </button>
        )}

        {/* Previous button */}
        <button
          onClick={() => navigateTo(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label={t.pagination.previousPage}
          className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
            ${
              currentPage <= 1
                ? 'opacity-30 cursor-not-allowed text-nordic-muted dark:text-hint-of-green/40'
                : 'text-nordic-dark dark:text-hint-of-green hover:bg-white dark:hover:bg-white/10 hover:shadow-sm border border-transparent hover:border-nordic-dark/10 dark:hover:border-white/10'
            }`}
        >
          <span className="material-icons text-[18px]">chevron_left</span>
          {!isSmallMobile && <span className="hidden xs:inline sm:inline text-xs sm:text-sm">{t.pagination.prev}</span>}
        </button>

        {/* Dynamic Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, idx) =>
            page === '...' ? (
              <span
                key={`ellipsis-${idx}`}
                className="w-7 sm:w-9 h-9 flex items-center justify-center text-nordic-muted dark:text-hint-of-green/40 text-xs sm:text-sm select-none"
              >
                &hellip;
              </span>
            ) : (
              <button
                key={`page-${page}`}
                onClick={() => navigateTo(page as number)}
                aria-label={interpolate(t.pagination.pageNumber, { page: page as number })}
                aria-current={page === currentPage ? 'page' : undefined}
                className={`min-w-8 sm:min-w-9 h-9 px-2 sm:px-3 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer
                  ${
                    page === currentPage
                      ? 'bg-nordic-dark text-white dark:bg-hint-of-green dark:text-nordic-dark shadow-sm font-semibold scale-105'
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
          aria-label={t.pagination.nextPage}
          className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
            ${
              currentPage >= totalPages
                ? 'opacity-30 cursor-not-allowed text-nordic-muted dark:text-hint-of-green/40'
                : 'text-nordic-dark dark:text-hint-of-green hover:bg-white dark:hover:bg-white/10 hover:shadow-sm border border-transparent hover:border-nordic-dark/10 dark:hover:border-white/10'
            }`}
        >
          {!isSmallMobile && <span className="hidden xs:inline sm:inline text-xs sm:text-sm">{t.pagination.next}</span>}
          <span className="material-icons text-[18px]">chevron_right</span>
        </button>

        {/* Last page button on larger screens */}
        {!isMobile && totalPages > 5 && (
          <button
            onClick={() => navigateTo(totalPages)}
            disabled={currentPage >= totalPages}
            aria-label={t.pagination.lastPage}
            title={t.pagination.lastPage}
            className={`hidden lg:flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all cursor-pointer
              ${
                currentPage >= totalPages
                  ? 'opacity-30 cursor-not-allowed text-nordic-muted dark:text-hint-of-green/40'
                  : 'text-nordic-dark dark:text-hint-of-green hover:bg-white dark:hover:bg-white/10 hover:shadow-sm border border-transparent hover:border-nordic-dark/10 dark:hover:border-white/10'
              }`}
          >
            <span className="material-icons text-base">last_page</span>
          </button>
        )}
      </div>
    </nav>
  );
};
