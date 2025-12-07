import React from 'react';

const PaginationControls = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages, hasNextPage, hasPreviousPage, totalItems } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (hasPreviousPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
      <div className="text-sm text-gray-700">
        Showing page {currentPage} of {totalPages} ({totalItems} total items)
      </div>
      <div className="flex gap-2">
        <button
          onClick={handlePrevious}
          disabled={!hasPreviousPage}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            hasPreviousPage
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!hasNextPage}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            hasNextPage
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;

