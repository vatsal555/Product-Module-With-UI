import React from 'react';
import { Link } from 'react-router-dom';
import { IProduct } from '../../types/product';
import { useMutation, useQueryClient } from 'react-query';
import { productAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import { useLoadingState } from '../../hooks/useLoadingState';
import { errorTracking } from '../../services/errorTracking';
import { Spinner } from '../common/Spinner';

interface ProductCardProps {
  product: IProduct;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function ProductCard({ product, isSelected, onSelect }: ProductCardProps) {
  const queryClient = useQueryClient();
  const { isLoading: isDeleteLoading, withLoading } = useLoadingState({
    trackError: true
  });

  const deleteMutation = useMutation(
    (id: string) => productAPI.deleteProduct(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success('Product deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete product');
      }
    }
  );

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this product?')) {
      await withLoading(async () => {
        try {
          await deleteMutation.mutateAsync(product._id);
        } catch (error) {
          errorTracking.trackError(error, {
            message: 'Failed to delete product',
            additionalData: { productId: product._id }
          });
          throw error;
        }
      });
    }
  };

  return (
    <div 
      className={`relative ${
        isSelected ? 'ring-2 ring-primary-500' : ''
      } bg-white dark:bg-dark-card rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
    >
      {onSelect && (
        <div className="absolute top-2 left-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-dark-bg"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
            {product.name}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            product.isActive 
              ? 'bg-accent-green/10 text-accent-green dark:bg-accent-green/20' 
              : 'bg-accent-red/10 text-accent-red dark:bg-accent-red/20'
          }`}>
            {product.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          <p>Brand: {product.brand}</p>
          <p>Category: {product.category}</p>
          <p className="font-semibold text-lg text-primary-600 dark:text-primary-400">
            ₹{product.price.toFixed(2)}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {product.colors.map((color, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300"
            >
              {color}
            </span>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center">
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
          <button
            onClick={handleDelete}
            className="text-accent-red hover:text-red-700 dark:text-accent-red dark:hover:text-red-400 text-sm font-medium disabled:opacity-50"
            disabled={deleteMutation.isLoading}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 