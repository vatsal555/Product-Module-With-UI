import express from "express";
import mongoose from "mongoose";
import {
  createMultipleProducts,
  createProduct,
  deleteMultipleProducts,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController";
import {
  multipleValidateRequest,
  validateRequest,
} from "../middleware/validateRequest";
import { Request, Response, NextFunction } from "express";
import Product from "../models/productModel";

const router = express.Router();

// Route to create a product
router.post("/CreateProduct", validateRequest, createProduct);

// Route to create multiple products
router.post(
  "/CreateMultipleProducts",
  createMultipleProducts
);

// Route to get all products
router.get("/GetAllProducts", async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("GetAllProducts route hit with query:", req.query);
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const skip = (page - 1) * limit;

    // Build query
    const queryConditions: any = {};

    // Search filter
    if (req.query.search) {
      queryConditions.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { brand: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Category filter
    if (req.query.category) {
      queryConditions.category = req.query.category;
    }

    // Price range filter
    if (req.query.priceMin || req.query.priceMax) {
      queryConditions.price = {};
      if (req.query.priceMin) {
        queryConditions.price.$gte = parseFloat(req.query.priceMin as string);
      }
      if (req.query.priceMax) {
        queryConditions.price.$lte = parseFloat(req.query.priceMax as string);
      }
    }

    // Create base query
    let query = Product.find(queryConditions);

    // Apply sorting
    const sortOptions: any = {
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      name: { name: 1 },
      createdAtDesc: { createdAt: -1 },
      createdAtAsc: { createdAt: 1 },
      ratingsDesc: { ratings: -1 }
    };

    if (req.query.sort && sortOptions[req.query.sort as string]) {
      query = query.sort(sortOptions[req.query.sort as string]);
    } else {
      // Default sort
      query = query.sort({ createdAt: -1 });
    }

    // Get total count for pagination
    const total = await Product.countDocuments(queryConditions);

    // Apply pagination
    const products = await query.skip(skip).limit(limit).exec();

    console.log("Products found:", products.length);

    res.status(200).json({
      success: true,
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Error in GetAllProducts:", error);
    next(error);
  }
});

// Route to get a single product by ID
router.get("/GetProductById/:id", getProductById);

// Route to update a product by ID
router.put("/UpdateProductById/:id", updateProduct);

// Route to delete multiple products by ID
router.delete("/DeleteMultipleProducts", deleteMultipleProducts);

// Route to delete a product by ID
router.delete("/DeleteProductById/:id", deleteProduct);

export default router;
