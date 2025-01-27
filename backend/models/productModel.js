"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        minlength: [3, "Product name must be at least 3 characters"],
        maxlength: [100, "Product name cannot exceed 100 characters"],
        unique: true,
        trim: true
    },
    brand: {
        type: String,
        required: [true, "Brand name is required"],
        minlength: [2, "Brand name must be at least 2 characters"],
        maxlength: [50, "Brand name cannot exceed 50 characters"]
    },
    seller: {
        type: String,
        required: [true, "Seller name is required"],
        minlength: [2, "Seller name must be at least 2 characters"],
        maxlength: [50, "Seller name cannot exceed 50 characters"]
    },
    product_description: {
        type: String,
        required: [true, "Product description is required"],
        minlength: [20, "Description must be at least 20 characters"],
        maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
        max: [999999.99, "Price cannot exceed ₹999,999.99"]
    },
    discount: {
        type: Number,
        min: [0, "Discount cannot be negative"],
        max: [100, "Discount cannot exceed 100%"]
    },
    ratings: {
        type: Number,
        min: [0, "Rating must be between 0 and 5"],
        max: [5, "Rating must be between 0 and 5"]
    },
    cod_availability: {
        type: Boolean,
        required: [true, "COD availability is required"]
    },
    total_stock_availability: {
        type: Number,
        required: [true, "Stock availability is required"],
        min: [0, "Stock cannot be negative"],
        max: [999999, "Stock cannot exceed 999,999 units"]
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: {
            values: ["electronics", "clothing", "others"],
            message: "Category must be electronics, clothing, or others"
        }
    },
    colors: {
        type: [String],
        required: [true, "At least one color is required"],
        validate: {
            validator: function (v) {
                return v.length > 0 && v.every(color => color.length >= 2 && color.length <= 20);
            },
            message: "Each color must be between 2 and 20 characters"
        }
    },
    // variants: {
    //   type: [String],
    //   validate: {
    //     validator: function(this: IProduct, v: string[]): boolean {
    //       if (this.category === "electronics") {
    //         return Array.isArray(v) && v.length > 0;
    //       }
    //       return !v || v.length === 0;
    //     },
    //     message: function(props: any) {
    //       if (props.value?.length === 0) {
    //         return "Electronics must have at least one variant";
    //       }
    //       return "Variants are only allowed for electronics category;";
    //     }
    //   }
    // },
    size: {
        type: [String],
        validate: {
            validator: function (v) {
                if (this.category === "clothing") {
                    return Array.isArray(v) && v.length > 0;
                }
                return !v || v.length === 0;
            },
            message: function (props) {
                var _a;
                if (((_a = props.value) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                    return "Clothing must have at least one size";
                }
                return "Sizes are only allowed for clothing category";
            }
        }
    },
    isActive: {
        type: Boolean,
        required: [true, "Active status is required"]
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
// Add compound index for better search performance
ProductSchema.index({ name: 1, brand: 1 }, { unique: true });
// Add pre-save middleware for additional validations
ProductSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Product = mongoose_1.default.model('Product');
            const existingProduct = yield Product.findOne({
                name: this.name,
                _id: { $ne: this._id }
            });
            if (existingProduct) {
                throw new Error('A product with this name already exists');
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
const productModel = mongoose_1.default.model("Product", ProductSchema);
exports.default = productModel;
