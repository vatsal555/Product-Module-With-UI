export interface IProduct {
  _id: string;
  name: string;
  brand: string;
  seller: string;
  product_description: string;
  price: number;
  discount: number | null;
  ratings: number | null;
  cod_availability: boolean;
  total_stock_availability: number;
  category: "electronics" | "clothing" | "others";
  isFeatured: boolean;
  isActive: boolean;
  variants?: (string | undefined)[];
  colors: (string | undefined)[];
  size?: (string | undefined)[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  ratings?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  success: boolean;
  data: IProduct[];
  total: number;
  page: number;
  limit: number;
} 