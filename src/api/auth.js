// src/api/auth.js
import axios from 'axios';
import { API_URL } from '../utils/constants';
// URL của API backend

// Hàm đăng nhập
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi đăng nhập');
  }
};
