import React, { useState, useCallback, useRef } from 'react';
import { ProductFilters as IProductFilters } from '../../types/product';
import debounce from 'lodash/debounce';

interface ProductFiltersProps {
  onFilterChange: (filters: IProductFilters) => void;
  currentFilters: IProductFilters;
  onSelectAll?: () => void;
  selectedCount?: number;
  totalCount?: number;
}

export default function ProductFilters({ 
  onFilterChange, 
  currentFilters,
  onSelectAll,
  selectedCount = 0,
  totalCount = 0
}: ProductFiltersProps) {
  // Local state for form inputs
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');
  const [priceMin, setPriceMin] = useState(currentFilters.priceMin?.toString() || '');
  const [priceMax, setPriceMax] = useState(currentFilters.priceMax?.toString() || '');

  // Create a debounced filter update function
  const debouncedUpdate = useRef(
    debounce((filters: Partial<IProductFilters>) => {
      onFilterChange({ ...currentFilters, ...filters });
    }, 800) // 800ms delay
  ).current;

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedUpdate({ search: value || undefined });
  };

  // Handle price inputs
  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    if (type === 'min') {
      setPriceMin(value);
    } else {
      setPriceMax(value);
    }

    // Only update if both fields are valid numbers or empty
    const min = type === 'min' ? value : priceMin;
    const max = type === 'max' ? value : priceMax;

    // Convert to numbers or undefined, handling empty strings
    const minNum = min !== '' ? parseFloat(min) : undefined;
    const maxNum = max !== '' ? parseFloat(max) : undefined;

    // Check if the values are valid numbers when they exist
    const isMinValid = minNum === undefined || !Number.isNaN(minNum);
    const isMaxValid = maxNum === undefined || !Number.isNaN(maxNum);

    if (isMinValid && isMaxValid) {
      debouncedUpdate({
        priceMin: minNum,
        priceMax: maxNum
      });
    }
  };

  // Handle immediate changes (category and sort)
  const handleImmediateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...currentFilters, [name]: value || undefined });
  };

  return (
    <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-md mb-6 transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Products
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-bg dark:text-dark-text transition-colors duration-200"
          />
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            name="category"
            value={currentFilters.category || ''}
            onChange={handleImmediateChange}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-bg dark:text-dark-text transition-colors duration-200"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="others">Others</option>
          </select>
        </div>

        {/* Price Range Inputs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price Range
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={priceMin}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              placeholder="Min"
              className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-bg dark:text-dark-text transition-colors duration-200"
            />
            <input
              type="number"
              value={priceMax}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              placeholder="Max"
              className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-bg dark:text-dark-text transition-colors duration-200"
            />
          </div>
        </div>

        {/* Sort Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>
          <select
            name="sort"
            value={currentFilters.sort || ''}
            onChange={handleImmediateChange}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-bg dark:text-dark-text transition-colors duration-200"
          >
            <option value="">Default</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="name">Name</option>
            <option value="createdAtDesc">Newest First</option>
            <option value="createdAtAsc">Oldest First</option>
            <option value="ratingsDesc">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Select All Section */}
      {onSelectAll && (
        <div className="mt-4 flex justify-between items-center border-t dark:border-gray-700 pt-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Total Products: {totalCount}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedCount === totalCount && totalCount > 0}
              onChange={onSelectAll}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-dark-bg transition-colors duration-200"
            />
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Select All ({selectedCount}/{totalCount})
            </label>
          </div>
        </div>
      )}
    </div>
  );
} 