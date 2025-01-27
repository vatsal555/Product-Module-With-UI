import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { productAPI } from '../../services/api';
import { ViewToggle, ViewType } from '../common/ViewToggle';
import { GridView } from './views/GridView';
import { ListView } from './views/ListView';
import { DetailedView } from './views/DetailedView';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import ProductFilters from './ProductFilters';
import { ProductFilters as IProductFilters, IProduct } from '../../types/product';
import { toast } from 'react-hot-toast';
import { ErrorAlert } from '../common/ErrorAlert';
import { NetworkErrorAlert } from '../common/NetworkErrorAlert';
import { Pagination } from '../common/Pagination';
import { LoadingOverlay } from '../common/LoadingOverlay';
import { useLoadingState } from '../../hooks/useLoadingState';
import { getStoredViewType, setStoredViewType } from '../../utils/storage';
// import { errorTracking } from '../../services/errorTracking';

const VIEW_LIMITS = {
  grid: 12,
  list: 25,
  detailed: 10
} as const;

export default function ProductList() {
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([]);
  const [viewType, setViewType] = useState<ViewType>(getStoredViewType());
  const [filters, setFilters] = React.useState<IProductFilters>({
    page: 1,
    limit: VIEW_LIMITS[getStoredViewType()],
    sort: 'createdAtDesc'
  });
  
  const queryClient = useQueryClient();

  const { isLoading: isBulkLoading } = useLoadingState({
    trackError: true
  });

  const { data, isLoading: isDataLoading, error, refetch } = useQuery(
    ['products', filters],
    () => productAPI.getAllProducts(filters),
    {
      onError: (error) => {
        toast.error('Failed to fetch products');
      },
      retry: 1000,
      staleTime: 30000
    }
  );

  const bulkDeleteMutation = useMutation(
    (ids: string[]) => productAPI.deleteMultipleProducts({ ids }),
    {
      onSuccess: (response) => {
        toast.success(response.message || 'Selected products deleted successfully');
        setSelectedProducts([]);
        queryClient.invalidateQueries(['products']);
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || 'Failed to delete products'
        );
      }
    }
  );

  const handleSelectProduct = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) 
        ? prev.filter(productId => productId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (data?.data) {
      setSelectedProducts(
        selectedProducts.length === data.data.length
          ? []
          : data.data.map((product: IProduct) => product._id)
      );
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products to delete');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      await bulkDeleteMutation.mutateAsync(selectedProducts);
    }
  };

  const totalPages = Math.ceil((data?.total || 0) / filters.limit!);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleViewChange = (newView: ViewType) => {
    setViewType(newView);
    setStoredViewType(newView);
    setFilters(prev => ({
      ...prev,
      page: 1,
      limit: VIEW_LIMITS[newView]
    }));
  };

  const renderProductView = () => {
    const viewProps = {
      products: data?.data || [],
      onSelect: handleSelectProduct,
      selectedIds: selectedProducts
    };

    switch (viewType) {
      case 'list':
        return <ListView {...viewProps} />;
      case 'detailed':
        return <DetailedView {...viewProps} />;
      default:
        return <GridView {...viewProps} />;
    }
  };

  if (isDataLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!navigator.onLine) {
    return <NetworkErrorAlert onRetry={refetch} />;
  }

  if (error) {
    return (
      <ErrorAlert 
        message="Failed to load products" 
        onRetry={() => refetch()} 
      />
    );
  }

  return (
    <>
      {isBulkLoading && <LoadingOverlay />}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
            Products
          </h1>
          <div className="flex space-x-4">
            {selectedProducts.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Delete Selected ({selectedProducts.length})
              </button>
            )}
            <button
              onClick={() => window.location.href = '/add-product'}
              className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Add Product
            </button>
          </div>
        </div>
        
        <ViewToggle 
          currentView={viewType} 
          onViewChange={handleViewChange} 
        />
        
        <ProductFilters 
          onFilterChange={setFilters} 
          currentFilters={filters}
          onSelectAll={handleSelectAll}
          selectedCount={selectedProducts.length}
          totalCount={data?.data.length || 0}
        />
        
        {renderProductView()}

        {data?.data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No products found</p>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={filters.page!}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
} 