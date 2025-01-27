import * as yup from 'yup';

export type ProductFormData = yup.InferType<typeof productValidationSchema>;

type Category = 'electronics' | 'clothing' | 'others';

// Product validation schema
export const productValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Product name is required')
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name cannot exceed 100 characters')
    .matches(
      /^[a-zA-Z0-9'&-\s]+$/,
      'Product name can only contain letters, numbers, spaces, and basic punctuation'
    ),

  brand: yup
    .string()
    .required('Brand name is required')
    .min(2, 'Brand name must be at least 2 characters')
    .max(50, 'Brand name cannot exceed 50 characters'),

  seller: yup
    .string()
    .required('Seller name is required')
    .min(2, 'Seller name must be at least 2 characters')
    .max(50, 'Seller name cannot exceed 50 characters'),

  product_description: yup
    .string()
    .required('Product description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description cannot exceed 1000 characters'),

  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be greater than 0')
    .max(999999.99, 'Price cannot exceed ₹999,999.99')
    .test('decimal-places', 'Price can only have up to 2 decimal places', 
      value => !value || Number.isInteger(value * 100)),

  discount: yup
    .number()
    .min(0, 'Discount cannot be less than 0%')
    .max(100, 'Discount cannot exceed 100%')
    .nullable(),

  ratings: yup
    .number()
    .min(0, 'Rating must be between 0 and 5')
    .max(5, 'Rating must be between 0 and 5')
    .test('decimal-places', 'Rating can only have 1 decimal place',
      value => !value || Number.isInteger(value * 10))
    .nullable(),

  cod_availability: yup
    .boolean()
    .required('COD availability is required'),

  total_stock_availability: yup
    .number()
    .required('Stock availability is required')
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(999999, 'Stock cannot exceed 999,999 units'),

  category: yup
    .string()
    .required('Category is required')
    .oneOf(['electronics', 'clothing', 'others'] as const, 'Invalid category') as yup.StringSchema<Category>,

  isFeatured: yup
    .boolean()
    .default(false),

  isActive: yup
    .boolean()
    .required('Status is required'),

  variants: yup.array().of(
    yup.object().shape({
      value: yup.string()
    })
  ).nullable(),

  colors: yup.array().of(
    yup.object().shape({
      value: yup.string().required('Color is required')
    })
  ),

  size: yup.array().of(
    yup.object().shape({
      value: yup.string()
    })
  ).nullable(),
});

// Helper function to validate a single field
export const validateField = async (
  fieldName: string, 
  value: any, 
  context: any = {}
): Promise<string | null> => {
  try {
    const schema = yup.reach(productValidationSchema, fieldName) as yup.Schema;
    await schema.validate(value, { context });
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    return 'Validation failed';
  }
};

// Helper function to format validation errors
export const formatValidationErrors = (errors: Record<string, any>) => {
  return Object.keys(errors).reduce((acc: Record<string, string[]>, key: string) => {
    acc[key] = Array.isArray(errors[key]) ? errors[key] : [errors[key]];
    return acc;
  }, {});
}; 