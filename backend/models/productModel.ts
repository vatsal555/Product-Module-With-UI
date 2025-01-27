import mongoose, { Schema, Document, CallbackError } from "mongoose";

export interface IProduct extends Document {
  name: string;
  brand: string;
  seller: string;
  product_description: string;
  price: number;
  discount: number;
  ratings: number;
  cod_availability: boolean;
  total_stock_availability: number;
  category: string;
  isFeatured: boolean;
  isActive: boolean;
  variants: string[]; // Array for multiple variant s
  colors: string[]; // Array for multiple colors
  size: string[]; // Array for multiple sizes
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
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
        validator: function(v: string[]) {
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
        validator: function(this: IProduct, v: string[]): boolean {
          if (this.category === "clothing") {
            return Array.isArray(v) && v.length > 0;
          }
          return !v || v.length === 0;
        },
        message: function(props: any) {
          if (props.value?.length === 0) {
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
  },
  { timestamps: true }
);

// Add compound index for better search performance
ProductSchema.index({ name: 1, brand: 1 }, { unique: true });

// Add pre-save middleware for additional validations
ProductSchema.pre('save', async function(next) {
  try {
    const Product = mongoose.model('Product');
    const existingProduct = await Product.findOne({ 
      name: this.name,
      _id: { $ne: this._id }
    });
    
    if (existingProduct) {
      throw new Error('A product with this name already exists');
    }
    
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

const productModel = mongoose.model<IProduct>("Product", ProductSchema);

export default productModel;
