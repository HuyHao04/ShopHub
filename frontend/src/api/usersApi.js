import axiosClient from './axiosClient';
import { handleApiError } from './errorHandler';

export const usersApi = {
  getAll: async () => {
    try {
      const response = await axiosClient.get('/users');
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to fetch users');
      throw new Error(errorMessage);
    }
  },
  getById: async (id) => {
    try {
      const response = await axiosClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to fetch user details');
      throw new Error(errorMessage);
    }
  },
};
