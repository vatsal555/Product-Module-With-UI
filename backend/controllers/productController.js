"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMultipleProducts = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createMultipleProducts = exports.createProduct = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const applicationError_1 = require("../error-handler/applicationError");
const features_1 = __importDefault(require("../utils/features"));
const logger_1 = __importDefault(require("../utils/logger"));
// Helper function to validate category-specific fields
const validateCategoryFields = (product) => {
    var _a, _b;
    if (product.category === "electronics" && !((_a = product.variants) === null || _a === void 0 ? void 0 : _a.length)) {
        return "Variants are required for electronics category";
    }
    if (product.category === "clothing" && !((_b = product.size) === null || _b === void 0 ? void 0 : _b.length)) {
        return "Size is required for clothing category";
    }
    return null;
};
// createProduct
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryError = validateCategoryFields(req.body);
        if (categoryError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: { category: [categoryError] }
            });
        }
        const product = yield productModel_1.default.create(req.body);
        logger_1.default.info(`Product created: ${product.name}`);
        return res.status(201).json({
            success: true,
            data: product,
            message: "Product created successfully",
        });
    }
    catch (error) {
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
            const errors = Object.keys(error.errors).reduce((acc, key) => {
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
        logger_1.default.error(`Error creating product: ${error.message}`);
        return res.status(400).json({
            success: false,
            message: "Failed to create product",
            errors: { general: [error.message] }
        });
    }
});
exports.createProduct = createProduct;
// createMultipleProducts
const createMultipleProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            return next(new applicationError_1.ApplicationError("Invalid or empty array of products provided", 400));
        }
        if (products.length > 500) {
            return next(new applicationError_1.ApplicationError("Cannot create more than 500 products at once", 400));
        }
        const success = [];
        const failed = [];
        // First validate all products
        const validationPromises = products.map((product, index) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const categoryError = validateCategoryFields(product);
                if (categoryError) {
                    return {
                        isValid: false,
                        index,
                        error: { field: "category", message: categoryError },
                    };
                }
                const existingProduct = yield productModel_1.default.findOne({ name: product.name });
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
            }
            catch (err) {
                return {
                    isValid: false,
                    index,
                    error: {
                        field: "unknown",
                        message: err instanceof Error ? err.message : "Unknown error",
                    },
                };
            }
        }));
        const validationResults = yield Promise.all(validationPromises);
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
                const newProduct = yield productModel_1.default.create(result.product);
                success.push({
                    id: newProduct._id,
                    name: newProduct.name,
                    message: "Created successfully",
                });
            }
            catch (err) {
                failed.push({
                    index: result.index,
                    error: {
                        field: "validation",
                        message: err instanceof Error ? err.message : "Creation failed",
                    },
                });
            }
        }
        logger_1.default.info(`Bulk product creation: ${success.length} succeeded, ${failed.length} failed`);
        res.status(201).json({
            success: true,
            results: {
                total: products.length,
                success: success.length,
                failed: failed.length,
                details: { success, failed },
            },
        });
    }
    catch (error) {
        logger_1.default.error(`Error in bulk product creation: ${error instanceof Error ? error.message : "Unknown error"}`);
        next(new applicationError_1.ApplicationError("Bulk creation failed", 500));
    }
});
exports.createMultipleProducts = createMultipleProducts;
// getAllProducts
const getAllProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryFeatures = {
            search: req.query.search,
            priceMin: req.query.priceMin
                ? parseFloat(req.query.priceMin)
                : undefined,
            priceMax: req.query.priceMax
                ? parseFloat(req.query.priceMax)
                : undefined,
            ratings: req.query.ratings,
            sort: req.query.sort,
            page: req.query.page ? parseInt(req.query.page, 10) : 1,
            limit: req.query.limit ? parseInt(req.query.limit, 10) : 25,
            category: req.query.category,
            colors: req.query.colors
                ? req.query.colors.split(",")
                : undefined,
            variants: req.query.variants
                ? req.query.variants.split(",")
                : undefined,
            size: req.query.size ? req.query.size.split(",") : undefined,
        };
        const { products, total, page, limit } = yield (0, features_1.default)(queryFeatures);
        logger_1.default.info(`Fetched ${products.length} products from the database (Total: ${total})`);
        res.status(200).json({
            success: true,
            total,
            page,
            limit,
            data: products,
        });
    }
    catch (error) {
        logger_1.default.error(`Error fetching products: ${error.message}`);
        next(new applicationError_1.ApplicationError(error.message, 500));
    }
});
exports.getAllProducts = getAllProducts;
// Get a product by ID
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel_1.default.findById(req.params.id);
        if (!product) {
            return next(new applicationError_1.ApplicationError("Product not found", 404));
        }
        logger_1.default.info(`Product with ID ${req.params.id} retrieved successfully`);
        res.status(200).json({ success: true, data: product });
    }
    catch (error) {
        logger_1.default.error(`Error retrieving product: ${error.message}`);
        next(new applicationError_1.ApplicationError(error.message, 400));
    }
});
exports.getProductById = getProductById;
// Update Product by ID
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryError = validateCategoryFields(req.body);
        if (categoryError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: { category: [categoryError] }
            });
        }
        const product = yield productModel_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
                errors: { general: ["Product not found"] }
            });
        }
        // Check for unique name if name is being updated
        if (req.body.name && req.body.name !== product.name) {
            const existingProduct = yield productModel_1.default.findOne({
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
            const updatedProduct = yield productModel_1.default.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
            return res.status(200).json({
                success: true,
                data: updatedProduct,
                message: "Product updated successfully"
            });
        }
        catch (error) {
            // Handle mongoose validation errors
            if (error.name === 'ValidationError') {
                const errors = Object.keys(error.errors).reduce((acc, key) => {
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update product",
            errors: { general: [error.message] }
        });
    }
});
exports.updateProduct = updateProduct;
// delete product by ID
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel_1.default.findByIdAndDelete(req.params.id);
        if (!product) {
            return next(new applicationError_1.ApplicationError("Product not found", 404));
        }
        logger_1.default.info(`Product with ID ${req.params.id} deleted successfully`);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        logger_1.default.error(`Error deleting product: ${error.message}`);
        next(new applicationError_1.ApplicationError(error.message, 400));
    }
});
exports.deleteProduct = deleteProduct;
// deleteMultipleProducts
const deleteMultipleProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No product IDs provided",
                errors: { general: ["Please select at least one product to delete"] }
            });
        }
        const deletedProducts = yield productModel_1.default.deleteMany({ _id: { $in: ids } });
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete products",
            errors: { general: [error.message] }
        });
    }
});
exports.deleteMultipleProducts = deleteMultipleProducts;
