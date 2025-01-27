import React from 'react';
import { IProduct } from '../../../types/product';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../../utils/formatters';

interface ListViewProps {
  products: IProduct[];
  onSelect?: (id: string) => void;
  selectedIds?: string[];
}

export const ListView: React.FC<ListViewProps> = ({ products, onSelect, selectedIds }) => {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="flex items-center bg-white dark:bg-dark-card p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          {onSelect && (
            <input
              type="checkbox"
              checked={selectedIds?.includes(product._id)}
              onChange={() => onSelect(product._id)}
              className="mr-4 h-4 w-4 rounded border-gray-300 dark:border-gray-600"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.brand}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-dark-text">
                  {formatPrice(product.price)}
                </p>
                {(product.discount ?? 0) > 0 && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {product.discount}% off
                  </p>
                )}
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div className="flex space-x-2">
                <Link
                  to={`/product/${product._id}`}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                >
                  View Details
                </Link>
                <Link
                  to={`/edit-product/${product._id}`}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                >
                  Edit
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Stock: {product.total_stock_availability}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 