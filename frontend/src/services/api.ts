import axios from 'axios';
import { IProduct, ProductFilters } from '../types/product';

const API = axios.create({
  baseURL: 'http://localhost:3000/api/products'
});

export const productAPI = {
  getAllProducts: async (filters?: ProductFilters) => {
    try {
      // Convert filters to query parameters
      const params = {
        search: filters?.search || '',
        category: filters?.category || '',
        priceMin: filters?.priceMin || undefined,
        priceMax: filters?.priceMax || undefined,
        sort: filters?.sort || '',
        page: filters?.page || 1,
        limit: filters?.limit || 9
      };

      // Remove undefined values
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
      );

      const response = await API.get('/GetAllProducts', { params: cleanParams });
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getProductById: async (id: string) => {
    const response = await API.get(`/GetProductById/${id}`);
    return response.data;
  },

  createProduct: async (product: Partial<IProduct>) => {
    try {
      const response = await API.post('/CreateProduct', product);
      return response.data;
    } catch (error: any) {
      console.error('Create Product Error:', {
        status: error.response?.status,
        data: error.response?.data,
        errors: error.response?.data?.errors
      });
      throw error;
    }
  },

  updateProduct: async (id: string, product: Partial<IProduct>) => {
    const response = await API.put(`/UpdateProductById/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await API.delete(`/DeleteProductById/${id}`);
    return response.data;
  },

  deleteMultipleProducts: async (data: { ids: string[] }) => {
    const response = await API.delete('/DeleteMultipleProducts', { 
      data: { ids: data.ids }
    });
    return response.data;
  }
}; 