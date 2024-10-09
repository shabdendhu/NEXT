// utils/axiosManager.js

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000, // Timeout of 10 seconds
  headers: {
    "Content-Type": "application/json",
    // You can add more default headers here if needed
  },
});

const axiosManager = {
  get: async (url, config = {}) => {
    try {
      const response = await axiosInstance.get(url, config);
      console.log("====================================");
      console.log(response);
      console.log("====================================");
      return response.data;
    } catch (error) {
      throw error.response.data || error;
    }
  },

  post: async (url, data, config = {}) => {
    try {
      const response = await axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error.response.data || error;
    }
  },

  // Add more methods like put, delete, etc. if needed
};

export default axiosManager;
