import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { productAPI } from '../../services/api';
import ProductForm from './ProductForm';
import { toast } from 'react-hot-toast';
import { LoadingOverlay } from '../common/LoadingOverlay';
import { ErrorAlert } from '../common/ErrorAlert';
import { ValidationErrors } from '../common/ValidationErrors';
import { ErrorToast } from '../common/ErrorToast';
import { IProduct } from '../../types/product';

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string[]>>({});

  const { data: response, isLoading: isLoadingProduct, error: fetchError } = useQuery(
    ['product', id],
    () => productAPI.getProductById(id!),
    {
      enabled: !!id,
      onError: () => {
        toast.error('Failed to fetch product');
        navigate('/');
      }
    }
  );

  const mutation = useMutation(
    (data: Partial<IProduct>) => productAPI.updateProduct(id!, data),
    {
      onSuccess: () => {
        toast.success('Product updated successfully');
        queryClient.invalidateQueries(['product', id]);
        navigate('/');
      },
      onError: (error: any) => {
        if (error.response?.data?.errors) {
          setValidationErrors(error.response.data.errors);
          
          const errorMessages = Object.values(error.response.data.errors).flat() as string[];
          toast.error(
            <ErrorToast 
              title="Validation Error" 
              messages={errorMessages}
            />,
            { duration: 5000 }
          );
        } else {
          toast.error(
            <ErrorToast 
              title="Error Updating Product"
              messages={[error.response?.data?.message || 'An unexpected error occurred']}
            />
          );
        }
      }
    }
  );

  const handleSubmit = (data: Partial<IProduct>) => {
    setValidationErrors({});
    mutation.mutate(data);
  };

  if (isLoadingProduct) {
    return <LoadingOverlay message="Loading product..." />;
  }

  if (fetchError) {
    return <ErrorAlert message="Failed to load product" />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Edit Product</h1>
      {Object.keys(validationErrors).length > 0 && (
        <ValidationErrors errors={validationErrors} />
      )}
      <ProductForm 
        initialData={response?.data}
        onSubmit={handleSubmit}
        isLoading={mutation.isLoading}
        validationErrors={validationErrors}
      />
    </div>
  );
} 