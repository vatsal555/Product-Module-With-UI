import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { productAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery(
    ['product', id],
    () => productAPI.getProductById(id!),
    {
      enabled: !!id,
      onError: () => {
        toast.error('Failed to fetch product details');
        navigate('/');
      }
    }
  );

  const product = response?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-dark-card shadow rounded-lg p-6 transition-colors duration-300">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Brand: {product.brand}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            product.isActive 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
          }`}>
            {product.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">
              Product Details
            </h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-dark-text">{product.category}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</dt>
                <dd className="mt-1 text-lg font-semibold text-primary-600 dark:text-primary-400">
                  ₹{product.price.toFixed(2)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Stock</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-dark-text">
                  {product.total_stock_availability}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">
              Additional Information
            </h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Colors</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {product.colors.map((color: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                    >
                      {color}
                    </span>
                  ))}
                </dd>
              </div>
              {product.category === 'electronics' && product.variants && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Variants</dt>
                  <dd className="mt-1 flex flex-wrap gap-2">
                    {product.variants.map((variant: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                      >
                        {variant}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {product.category === 'clothing' && product.size && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Sizes</dt>
                  <dd className="mt-1 flex flex-wrap gap-2">
                    {product.size.map((size: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                      >
                        {size}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">Description</h2>
          <p className="text-gray-600 dark:text-gray-300">{product.product_description}</p>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => navigate(`/edit-product/${product._id}`)}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 text-white rounded-md transition-colors duration-200"
          >
            Edit Product
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
} 