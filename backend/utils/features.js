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
const productModel_1 = __importDefault(require("../models/productModel"));
const getFilteredSortedPaginatedProducts = (queryFeatures) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, ratings, priceMin, priceMax, sort, page = 1, limit = 25, category, colors, variants, size, } = queryFeatures;
    if (queryFeatures["page"] && queryFeatures["page"] > 0) {
        queryFeatures = Object.assign(Object.assign({}, queryFeatures), { page: queryFeatures["page"] || 1 });
    }
    if (queryFeatures["limit"] && queryFeatures["limit"] > 0) {
        queryFeatures = Object.assign(Object.assign({}, queryFeatures), { limit: queryFeatures["page"] || 25 });
    }
    const query = {};
    // Filter by product name (search)
    if (search) {
        query.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    // Filter by product ratings
    if (ratings) {
        query.ratings = { $gte: parseFloat(ratings) };
    }
    // Filter by price range
    if (priceMin !== undefined || priceMax !== undefined) {
        query.price = {};
        if (priceMin !== undefined) {
            query.price.$gte = priceMin;
        }
        if (priceMax !== undefined) {
            query.price.$lte = priceMax;
        }
    }
    // Add base category filter
    if (category) {
        query.category = category;
    }
    // Additional filters for variants and colors (electronics) or size and colors (clothing)
    if (category === "electronics") {
        if (colors) {
            query.colors = { $in: colors }; // Filter by colors
        }
        if (variants) {
            query.variants = { $in: variants }; // Filter by variants
        }
    }
    if (category === "clothing") {
        if (colors) {
            query.colors = { $in: colors }; // Filter by colors
        }
        if (size) {
            query.size = { $in: size }; // Filter by size
        }
    }
    // Sorting options
    const sortOptionsMap = {
        name: { name: 1 },
        priceAsc: { price: 1 },
        priceDesc: { price: -1 },
        createdAtAsc: { createdAt: 1 },
        updatedAtAsc: { updatedAt: 1 },
        createdAtDesc: { createdAt: -1 },
        updatedAtDesc: { updatedAt: -1 },
        ratingsAsc: { ratings: 1 },
        ratingsDesc: { ratings: -1 },
    };
    const sortOption = sort ? sortOptionsMap[sort] : {};
    // Fetch filtered, sorted, and paginated products
    const products = yield productModel_1.default.find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);
    const total = yield productModel_1.default.countDocuments(query);
    return {
        products,
        total,
        page,
        limit,
    };
});
exports.default = getFilteredSortedPaginatedProducts;
