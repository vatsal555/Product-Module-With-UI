import React from 'react';
import { IProduct } from '../../../types/product';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../../utils/formatters';

interface DetailedViewProps {
  products: IProduct[];
  onSelect?: (id: string) => void;
  selectedIds?: string[];
}

export const DetailedView: React.FC<DetailedViewProps> = ({ products, onSelect, selectedIds }) => {
  return (
    <div className="space-y-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-start">
                {onSelect && (
                  <input
                    type="checkbox"
                    checked={selectedIds?.includes(product._id)}
                    onChange={() => onSelect(product._id)}
                    className="mt-1 mr-4 h-4 w-4 rounded border-gray-300 dark:border-gray-600"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Brand: {product.brand} | Seller: {product.seller}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">{product.product_description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.colors?.map((color) => (
                  <span
                    key={color}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                {formatPrice(product.price)}
              </p>
              {(product.discount ?? 0) > 0 && (
                <p className="text-lg text-green-600 dark:text-green-400">
                  {product.discount}% off
                </p>
              )}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex space-x-4">
              <Link
                to={`/product/${product._id}`}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                View Details
              </Link>
              <Link
                to={`/edit-product/${product._id}`}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Edit
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.isActive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
              }`}>
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Stock: {product.total_stock_availability}
              </span>
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                  {product.ratings || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 