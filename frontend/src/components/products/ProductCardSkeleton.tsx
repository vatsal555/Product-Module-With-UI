import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden animate-pulse transition-colors duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        <div className="mt-4 flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}; 