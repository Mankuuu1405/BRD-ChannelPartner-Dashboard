// src/services/productLoanService.js
import axiosInstance from "../utils/axiosInstance";

// Base URL as per Django router
const BASE_URL = "product/";

export const productLoanAPI = {
  // Get all products
  getAll() {
    return axiosInstance.get(BASE_URL);
  },

  // Get product by ID
  getById(id) {
    return axiosInstance.get(`${BASE_URL}${id}/`);
  },

  // Create new product
  create(data) {
    return axiosInstance.post(BASE_URL, data);
  },

  // Update product (partial update)
  update(id, data) {
    return axiosInstance.patch(`${BASE_URL}${id}/`, data);
  },

  // Delete product
  delete(id) {
    return axiosInstance.delete(`${BASE_URL}${id}/`);
  },
};
