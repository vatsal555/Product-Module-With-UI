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
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const validateRequest_1 = require("../middleware/validateRequest");
const productModel_1 = __importDefault(require("../models/productModel"));
const router = express_1.default.Router();
// Route to create a product
router.post("/CreateProduct", validateRequest_1.validateRequest, productController_1.createProduct);
// Route to create multiple products
router.post("/CreateMultipleProducts", productController_1.createMultipleProducts);
// Route to get all products
router.get("/GetAllProducts", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("GetAllProducts route hit with query:", req.query);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;
        // Build query
        const queryConditions = {};
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
                queryConditions.price.$gte = parseFloat(req.query.priceMin);
            }
            if (req.query.priceMax) {
                queryConditions.price.$lte = parseFloat(req.query.priceMax);
            }
        }
        // Create base query
        let query = productModel_1.default.find(queryConditions);
        // Apply sorting
        const sortOptions = {
            priceAsc: { price: 1 },
            priceDesc: { price: -1 },
            name: { name: 1 },
            createdAtDesc: { createdAt: -1 },
            createdAtAsc: { createdAt: 1 },
            ratingsDesc: { ratings: -1 }
        };
        if (req.query.sort && sortOptions[req.query.sort]) {
            query = query.sort(sortOptions[req.query.sort]);
        }
        else {
            // Default sort
            query = query.sort({ createdAt: -1 });
        }
        // Get total count for pagination
        const total = yield productModel_1.default.countDocuments(queryConditions);
        // Apply pagination
        const products = yield query.skip(skip).limit(limit).exec();
        console.log("Products found:", products.length);
        res.status(200).json({
            success: true,
            data: products,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    }
    catch (error) {
        console.error("Error in GetAllProducts:", error);
        next(error);
    }
}));
// Route to get a single product by ID
router.get("/GetProductById/:id", productController_1.getProductById);
// Route to update a product by ID
router.put("/UpdateProductById/:id", productController_1.updateProduct);
// Route to delete multiple products by ID
router.delete("/DeleteMultipleProducts", productController_1.deleteMultipleProducts);
// Route to delete a product by ID
router.delete("/DeleteProductById/:id", productController_1.deleteProduct);
exports.default = router;
