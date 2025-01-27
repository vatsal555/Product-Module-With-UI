import React from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { toast } from 'react-hot-toast';
import ProductForm from './ProductForm';
import { IProduct } from '../../types/product';
import { ValidationErrors } from '../common/ValidationErrors';
import { ErrorToast } from '../common/ErrorToast';

export default function AddProduct() {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string[]>>({});

  const mutation = useMutation(productAPI.createProduct, {
    onSuccess: () => {
      toast.success('Product created successfully');
      navigate('/');
    },
    onError: (error: any) => {
      console.log('Error response:', error.response?.data); // Debug log
      
      if (error.response?.data?.errors) {
        // Set validation errors from the backend
        setValidationErrors(error.response.data.errors);
        
        // Show error toast with validation messages
        const errorMessages = Object.values(error.response.data.errors).flat() as string[];
        toast.error(
          <ErrorToast 
            title="Validation Error" 
            messages={errorMessages}
          />,
          { duration: 5000 }
        );
      } else {
        // Show generic error message
        toast.error(
          <ErrorToast 
            title="Error Creating Product"
            messages={[error.response?.data?.message || 'An unexpected error occurred']}
          />,
          { duration: 5000 }
        );
      }
    }
  });

  const handleSubmit = (data: Partial<IProduct>) => {
    setValidationErrors({}); // Clear previous errors
    console.log('Submitting data:', data); // Debug log
    mutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Add New Product</h1>
      {Object.keys(validationErrors).length > 0 && (
        <ValidationErrors errors={validationErrors} />
      )}
      <ProductForm 
        onSubmit={handleSubmit} 
        isLoading={mutation.isLoading}
        validationErrors={validationErrors}
      />
    </div>
  );
} 