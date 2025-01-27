import Joi from "joi";
import mongoose from "mongoose";

// Define validation schema for a single product
const singleProductSchema = {
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .pattern(/^[a-zA-Z0-9'&-\s]+$/)
    .required()
    .external(async (value) => {
      // Check for existing product with same name
      const Product = mongoose.model('Product');
      const existing = await Product.findOne({ name: value });
      if (existing) {
        throw new Error('A product with this name already exists');
      }
      return value;
    })
    .messages({
      "string.pattern.base": "Product name can only contain letters, numbers, spaces, and basic punctuation",
      "string.empty": "Product name is required",
      "string.min": "Product name must be at least {#limit} characters",
      "string.max": "Product name cannot exceed {#limit} characters",
      "any.required": "Product name is required",
      "any.custom": "A product with this name already exists"
    }),
  brand: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Brand name is required",
      "string.min": "Brand name must be at least {#limit} characters",
      "string.max": "Brand name cannot exceed {#limit} characters",
      "any.required": "Brand name is required"
    }),
  seller: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Seller name is required",
      "string.min": "Seller name must be at least {#limit} characters",
      "string.max": "Seller name cannot exceed {#limit} characters",
      "any.required": "Seller name is required"
    }),
  product_description: Joi.string()
    .trim()
    .min(20)
    .max(1000)
    .required()
    .messages({
      "string.empty": "Product description is required",
      "string.min": "Description must be at least {#limit} characters",
      "string.max": "Description cannot exceed {#limit} characters",
      "any.required": "Product description is required"
    }),
  price: Joi.number()
    .positive()
    .precision(2)
    .max(999999.99)
    .required()
    .messages({
      "number.base": "Price must be a valid number",
      "number.positive": "Price must be greater than 0",
      "number.max": "Price cannot exceed ₹999,999.99",
      "number.precision": "Price can only have up to 2 decimal places",
      "any.required": "Price is required"
    }),
  discount: Joi.number()
    .min(0)
    .max(100)
    .optional()
    .messages({
      "number.min": "Discount cannot be less than 0%",
      "number.max": "Discount cannot exceed 100%"
    }),
  ratings: Joi.number()
    .min(0)
    .max(5)
    .precision(1)
    .optional()
    .messages({
      "number.min": "Rating must be between 0 and 5",
      "number.max": "Rating must be between 0 and 5",
      "number.precision": "Rating can only have 1 decimal place"
    }),
  cod_availability: Joi.boolean().required().messages({
    "boolean.base": "COD availability must be true or false",
    "any.required": "COD availability is required",
  }),
  total_stock_availability: Joi.number()
    .integer()
    .min(0)
    .max(999999)
    .required()
    .messages({
      "number.base": "Stock must be a valid number",
      "number.integer": "Stock must be a whole number",
      "number.min": "Stock cannot be negative",
      "number.max": "Stock cannot exceed 999,999 units",
      "any.required": "Stock availability is required"
    }),
  category: Joi.string()
    .valid("electronics", "clothing", "others")
    .required()
    .messages({
      "any.only": "Category must be one of: electronics, clothing, or others",
      "any.required": "Category is required"
    }),
  isFeatured: Joi.boolean().default(false),
  isActive: Joi.boolean().required().messages({
    "boolean.base": "Status must be true or false",
    "any.required": "Status is required"
  }),
  variants: Joi.when('category', {
    is: 'electronics',
    then: Joi.array()
      .items(Joi.string().trim().min(2).max(50))
      .min(1)
      .required()
      .messages({
        'array.base': 'Variants must be an array',
        'array.min': 'At least one variant is required for electronics',
        'array.unique': 'Variants must be unique',
        'any.required': 'Variants are required for electronics'
      }),
    otherwise: Joi.array()
      .max(0)
      .messages({
        'array.max': 'Variants are only allowed for electronics category'
      })
  }),
  colors: Joi.array()
    .items(Joi.string().trim().min(2).max(20))
    .min(1)
    .unique()
    .required()
    .messages({
      "array.base": "Colors must be an array",
      "array.min": "At least one color is required",
      "array.unique": "Colors must be unique",
      "string.min": "Color name must be at least {#limit} characters",
      "string.max": "Color name cannot exceed {#limit} characters",
      "any.required": "Colors are required"
    }),
  size: Joi.when('category', {
    is: 'clothing',
    then: Joi.array()
      .items(Joi.string().trim().min(1).max(10))
      .min(1)
      .required()
      .messages({
        'array.base': 'Sizes must be an array',
        'array.min': 'At least one size is required for clothing',
        'array.unique': 'Sizes must be unique',
        'any.required': 'Sizes are required for clothing'
      }),
    otherwise: Joi.array()
      .max(0)
      .messages({
        'array.max': 'Sizes are only allowed for clothing category'
      })
  }),
};

// Schema for single product validation
const productSchema = Joi.object(singleProductSchema);

// Schema for multiple products validation
const multipleProductSchema = Joi.array()
  .items(Joi.object(singleProductSchema))
  .min(1)
  .required()
  .messages({
    "array.base": "Request body must be an array of products",
    "array.min": "At least one product is required",
    "any.required": "Product data is required",
  });

export { productSchema, multipleProductSchema };
