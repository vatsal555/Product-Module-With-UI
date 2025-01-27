import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { IProduct } from '../../types/product';
import { yupResolver } from '@hookform/resolvers/yup';
import { productValidationSchema, formatValidationErrors } from '../../validation/productValidation';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Resolver } from 'react-hook-form';

interface ProductFormProps {
  initialData?: Partial<IProduct>;
  onSubmit: (data: Partial<IProduct>) => void;
  isLoading: boolean;
  validationErrors?: Record<string, string[]>;
}

// Update the FormInputs interface to properly type the arrays
interface FormInputs {
  name: string;
  brand: string;
  seller: string;
  price: number;
  product_description: string;
  colors: { value: string }[];
  variants?: { value: string }[] | null;
  size?: { value: string }[] | null;
  category: 'electronics' | 'clothing' | 'others';
  isActive: boolean;
  isFeatured: boolean;
  total_stock_availability: number;
  cod_availability: boolean;
  discount?: number | null;
  ratings?: number | null;
}

// Add this helper function at the top of the file
const getFieldError = (fieldName: string, errors?: Record<string, string[]>) => {
  if (!errors || !errors[fieldName]) return null;
  return errors[fieldName][0]; // Return first error message for the field
};

// Add this transformation before useForm
const transformInitialData = (data?: Partial<IProduct>): Partial<FormInputs> | undefined => {
  if (!data) return undefined;
  return {
    ...data,
    colors: data.colors?.filter((c): c is string => c !== undefined)
      .map(c => ({ value: c })) || [],
    variants: data.variants?.filter((v): v is string => v !== undefined)
      .map(v => ({ value: v })) || null,
    size: data.size?.filter((s): s is string => s !== undefined)
      .map(s => ({ value: s })) || null,
    discount: data.discount || null,
    ratings: data.ratings || null
  };
};

// Update input field classes with better contrast
const inputClasses = "w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100 sm:text-sm transition-colors duration-200";

export default function ProductForm({
  initialData,
  onSubmit,
  isLoading,
  validationErrors
}: ProductFormProps) {
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors }, 
    control,
    setValue
  } = useForm<FormInputs>({
    resolver: yupResolver(productValidationSchema) as Resolver<FormInputs>,
    defaultValues: transformInitialData(initialData) || {
      category: 'others',
      isActive: true,
      isFeatured: false,
      cod_availability: true,
      colors: [{ value: '' }],
      variants: null,
      size: null,
      total_stock_availability: 0,
      price: 0
    }
  });

  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray<FormInputs>({
    control,
    name: 'colors',
    rules: { required: true }
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray<FormInputs>({
    control,
    name: 'variants',
    rules: { required: false }
  });

  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray<FormInputs>({
    control,
    name: 'size',
    rules: { required: false }
  });

  // Update append handlers to match new type
  const handleAddColor = () => appendColor({ value: '' });
  const handleAddVariant = () => appendVariant({ value: '' });
  const handleAddSize = () => appendSize({ value: '' });

  const category = watch('category');

  // Update the useEffect to handle colors initialization
  React.useEffect(() => {
    if (category === 'electronics') {
      setValue('size', [], { shouldValidate: true });
      if (!variantFields.length) {
        appendVariant({ value: '' });
      }
    } else if (category === 'clothing') {
      setValue('variants', [], { shouldValidate: true });
      if (!sizeFields.length) {
        appendSize({ value: '' });
      }
    } else {
      setValue('variants', [], { shouldValidate: true });
      setValue('size', [], { shouldValidate: true });
    }

    // Always ensure at least one color field
    if (!colorFields.length) {
      appendColor({ value: '' });
    }
  }, [
    category,
    setValue,
    appendVariant,
    appendSize,
    appendColor,
    colorFields.length,
    variantFields.length,
    sizeFields.length
  ]);

  // Only render category-specific fields if they're needed
  const renderVariants = category === 'electronics' && (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Variants
      </label>
      <div className="space-y-3">
        {variantFields.map((field, index) => (
          <div key={field.id} className="flex gap-3">
            <input
              {...register(`variants.${index}.value`)}
              className={`${inputClasses} ${getFieldError(`variants.${index}.value`, validationErrors)
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
              }`}
            />
            {variantFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddVariant}
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          + Add Variant
        </button>
      </div>
    </div>
  );

  const renderSizes = category === 'clothing' && (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Sizes
      </label>
      <div className="space-y-3">
        {sizeFields.map((field, index) => (
          <div key={field.id} className="flex gap-3">
            <input
              {...register(`size.${index}.value`)}
              className={`${inputClasses} ${getFieldError(`size.${index}.value`, validationErrors)
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
              }`}
            />
            {sizeFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeSize(index)}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSize}
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          + Add Size
        </button>
      </div>
    </div>
  );

  const onFormSubmit = async (data: FormInputs) => {
    try {
      await productValidationSchema.validate(data, { abortEarly: false });
      // Transform the data to match IProduct interface
      const transformedData = {
        ...data,
        colors: data.colors.map(c => c.value),
        variants: data.variants?.map(v => v.value),
        size: data.size?.map(s => s.value)
      };
      onSubmit(transformedData);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const formattedErrors = formatValidationErrors(
          error.inner.reduce<Record<string, string>>((acc, err) => ({
            ...acc,
            [err.path || '']: err.message
          }), {})
        );
        console.error('Validation errors:', formattedErrors);
      }
    }
  };

  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="max-w-7xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg px-6 py-8 transition-colors duration-300">
        {/* Header Section */}
        <div className="border-b dark:border-gray-700 pb-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Product Information
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Basic information about the product.
          </p>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              {...register('name')}
              className={inputClasses}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Brand
            </label>
            <input
              {...register('brand')}
              className={inputClasses}
            />
            {errors.brand && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.brand.message}
              </p>
            )}
          </div>

          {/* Seller */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Seller
            </label>
            <input
              {...register('seller')}
              className={inputClasses}
            />
            {errors.seller && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.seller.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              {...register('category')}
              className={`${inputClasses} dark:bg-gray-800`}
            >
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              {...register('price')}
              className={inputClasses}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock
            </label>
            <input
              type="number"
              {...register('total_stock_availability')}
              className={inputClasses}
            />
            {errors.total_stock_availability && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.total_stock_availability.message}
              </p>
            )}
          </div>

          {/* Colors Section - Full Width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Colors
            </label>
            <div className="space-y-3">
              {colorFields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                  <input
                    {...register(`colors.${index}.value`)}
                    className={inputClasses}
                  />
                  {colorFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="px-3 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddColor}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                + Add Color
              </button>
            </div>
          </div>

          {/* Category Specific Fields - Full Width */}
          {renderVariants}
          {renderSizes}

          {/* Description - Full Width */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              {...register('product_description')}
              rows={4}
              className={inputClasses}
            />
            {errors.product_description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.product_description.message}
              </p>
            )}
          </div>

          {/* Checkboxes Section */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('isActive')}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:checked:bg-primary-500"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Active</label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('isFeatured')}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:checked:bg-primary-500"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Featured</label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('cod_availability')}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:checked:bg-primary-500"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Cash on Delivery</label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 text-white rounded-md transition-colors duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
} 