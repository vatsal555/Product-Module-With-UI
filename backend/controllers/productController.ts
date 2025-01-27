import { Request, Response, NextFunction } from "express";
import Product, { IProduct } from "../models/productModel";
import { ApplicationError } from "../error-handler/applicationError";
import getFilteredSortedPaginatedProducts from "../utils/features";
import logger from "../utils/logger";

interface ProductUpdate {
  id: string;
  updateData: Partial<IProduct>;
}

// Update the AsyncRequestHandler type to allow Response return type
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

// Helper function to validate category-specific fields
const validateCategoryFields = (product: Partial<IProduct>): string | null => {
  if (product.category === "electronics" && !product.variants?.length) {
    return "Variants are required for electronics category";
  }
  if (product.category === "clothing" && !product.size?.length) {
    return "Size is required for clothing category";
  }
  return null;
};

// createProduct
export const createProduct: AsyncRequestHandler = async (req, res, next) => {
  try {
    const categoryError = validateCategoryFields(req.body);
    if (categoryError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: { category: [categoryError] }
      });
    }

    const product = await Product.create(req.body);
    logger.info(`Product created: ${product.name}`);

    return res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully",
    });
  } catch (error: any) {
    // Log the full error for debugging
    console.error('Product creation error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: {
          [field]: [`Product with ${field} "${value}" already exists`]
        }
      });
    }
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).reduce((acc: any, key) => {
        acc[key] = [error.errors[key].message];
        return acc;
      }, {});
      
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    // Handle other errors
    logger.error(`Error creating product: ${error.message}`);
    return res.status(400).json({
      success: false,
      message: "Failed to create product",
      errors: { general: [error.message] }
    });
  }
};

// createMultipleProducts
export const createMultipleProducts: AsyncRequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const products = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return next(
        new ApplicationError("Invalid or empty array of products provided", 400)
      );
    }

    if (products.length > 500) {
      return next(
        new ApplicationError("Cannot create more than 500 products at once", 400)
      );
    }

    const success = [];
    const failed = [];

    // First validate all products
    const validationPromises = products.map(async (product, index) => {
      try {
        const categoryError = validateCategoryFields(product);
        if (categoryError) {
          return {
            isValid: false,
            index,
            error: { field: "category", message: categoryError },
          };
        }

        const existingProduct = await Product.findOne({ name: product.name });
        if (existingProduct) {
          return {
            isValid: false,
            index,
            error: {
              field: "name",
              message: `Product with name '${product.name}' already exists`,
            },
          };
        }

        return { isValid: true, index, product };
      } catch (err) {
        return {
          isValid: false,
          index,
          error: {
            field: "unknown",
            message: err instanceof Error ? err.message : "Unknown error",
          },
        };
      }
    });

    const validationResults = await Promise.all(validationPromises);

    // Process validated products
    for (const result of validationResults) {
      if (!result.isValid) {
        failed.push({
          index: result.index,
          error: result.error,
        });
        continue;
      }

      try {
        const newProduct = await Product.create(result.product);
        success.push({
          id: newProduct._id,
          name: newProduct.name,
          message: "Created successfully",
        });
      } catch (err) {
        failed.push({
          index: result.index,
          error: {
            field: "validation",
            message: err instanceof Error ? err.message : "Creation failed",
          },
        });
      }
    }

    logger.info(
      `Bulk product creation: ${success.length} succeeded, ${failed.length} failed`
    );

    res.status(201).json({
      success: true,
      results: {
        total: products.length,
        success: success.length,
        failed: failed.length,
        details: { success, failed },
      },
    });
  } catch (error) {
    logger.error(
      `Error in bulk product creation: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    next(new ApplicationError("Bulk creation failed", 500));
  }
};

// getAllProducts
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryFeatures = {
      search: req.query.search as string,
      priceMin: req.query.priceMin
        ? parseFloat(req.query.priceMin as string)
        : undefined,
      priceMax: req.query.priceMax
        ? parseFloat(req.query.priceMax as string)
        : undefined,
      ratings: req.query.ratings as string,
      sort: req.query.sort as
        | "name"
        | "createdAtAsc"
        | "updatedAtAsc"
        | "createdAtDesc"
        | "updatedAtDesc"
        | "priceAsc"
        | "priceDesc"
        | "ratingsAsc"
        | "ratingsDesc"
        | undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 25,
      category: req.query.category as "electronics" | "clothing" | undefined,
      colors: req.query.colors
        ? (req.query.colors as string).split(",")
        : undefined,
      variants: req.query.variants
        ? (req.query.variants as string).split(",")
        : undefined,
      size: req.query.size ? (req.query.size as string).split(",") : undefined,
    };

    const { products, total, page, limit } =
      await getFilteredSortedPaginatedProducts(queryFeatures);

    logger.info(
      `Fetched ${products.length} products from the database (Total: ${total})`
    );

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      data: products,
    });
  } catch (error) {
    logger.error(`Error fetching products: ${(error as Error).message}`);
    next(new ApplicationError((error as Error).message, 500));
  }
};

// Get a product by ID
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ApplicationError("Product not found", 404));
    }
    logger.info(`Product with ID ${req.params.id} retrieved successfully`);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    logger.error(`Error retrieving product: ${(error as Error).message}`);
    next(new ApplicationError((error as Error).message, 400));
  }
};

// Update Product by ID
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryError = validateCategoryFields(req.body);
    if (categoryError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: { category: [categoryError] }
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        errors: { general: ["Product not found"] }
      });
    }

    // Check for unique name if name is being updated
    if (req.body.name && req.body.name !== product.name) {
      const existingProduct = await Product.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id }
      });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: { name: [`Product with name '${req.body.name}' already exists`] }
        });
      }
    }

    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        data: updatedProduct,
        message: "Product updated successfully"
      });
    } catch (error: any) {
      // Handle mongoose validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.keys(error.errors).reduce((acc: any, key) => {
          acc[key] = [error.errors[key].message];
          return acc;
        }, {});
        
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors
        });
      }
      throw error;
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      errors: { general: [error.message] }
    });
  }
};

// delete product by ID
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return next(new ApplicationError("Product not found", 404));
    }
    logger.info(`Product with ID ${req.params.id} deleted successfully`);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    logger.error(`Error deleting product: ${(error as Error).message}`);
    next(new ApplicationError((error as Error).message, 400));
  }
};

// deleteMultipleProducts
export const deleteMultipleProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No product IDs provided",
        errors: { general: ["Please select at least one product to delete"] }
      });
    }

    const deletedProducts = await Product.deleteMany({ _id: { $in: ids } });

    if (deletedProducts.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found to delete",
        errors: { general: ["Selected products not found"] }
      });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${deletedProducts.deletedCount} products`,
      data: {
        deletedCount: deletedProducts.deletedCount
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete products",
      errors: { general: [error.message] }
    });
  }
};
