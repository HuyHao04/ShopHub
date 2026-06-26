import axiosClient from './axiosClient';
import { handleApiError } from './errorHandler';

export const productsApi = {
  getAll: async (params) => {
    try {
      const response = await axiosClient.get('/products', { params });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to fetch products');
      throw new Error(errorMessage);
    }
  },
  getById: async (id) => {
    try {
      const response = await axiosClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to fetch product details');
      throw new Error(errorMessage);
    }
  },
};
