import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const showPages = pages.slice(
    Math.max(0, currentPage - 2),
    Math.min(totalPages, currentPage + 1)
  );

  return (
    <div className="flex items-center justify-center space-x-1 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Previous
      </button>
      
      {currentPage > 3 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            1
          </button>
          <span className="px-2 py-1 text-gray-500">...</span>
        </>
      )}

      {showPages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === page
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages - 2 && (
        <>
          <span className="px-2 py-1 text-gray-500">...</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Next
      </button>
    </div>
  );
}; 